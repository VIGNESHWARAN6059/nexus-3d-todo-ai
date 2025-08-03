#!/usr/bin/env node

/**
 * Environment Validation Script
 * Validates that all required environment variables are set
 * and provides helpful error messages for missing configurations
 */

const fs = require("fs")
const path = require("path")

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
}

// Helper functions for colored output
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  header: (msg) => console.log(`${colors.cyan}${msg}${colors.reset}`),
}

// Required environment variables with descriptions
const requiredEnvVars = [
  {
    name: "NEXT_PUBLIC_APP_NAME",
    description: "Application name displayed in the UI",
    defaultValue: "Ultra Todo",
    required: false,
  },
  {
    name: "NEXT_PUBLIC_APP_VERSION",
    description: "Application version number",
    defaultValue: "1.0.0",
    required: false,
  },
  {
    name: "NODE_ENV",
    description: "Node.js environment (development/production)",
    defaultValue: "development",
    required: false,
  },
]

// Optional environment variables that enhance functionality
const optionalEnvVars = [
  {
    name: "NEXT_PUBLIC_DEV_MODE",
    description: "Enable development mode features",
    defaultValue: "true",
  },
  {
    name: "NEXT_PUBLIC_WEBGL_DEBUG",
    description: "Enable WebGL debugging for 3D features",
    defaultValue: "false",
  },
  {
    name: "NEXT_PUBLIC_THREE_DEBUG",
    description: "Enable Three.js debugging",
    defaultValue: "false",
  },
  {
    name: "NEXT_PUBLIC_VOICE_ENABLED",
    description: "Enable voice control features",
    defaultValue: "true",
  },
  {
    name: "NEXT_PUBLIC_SPEECH_LANG",
    description: "Language for speech recognition",
    defaultValue: "en-US",
  },
  {
    name: "NEXT_PUBLIC_PERFORMANCE_MONITORING",
    description: "Enable performance monitoring",
    defaultValue: "false",
  },
]

// External service environment variables
const externalServiceVars = [
  {
    name: "GOOGLE_CALENDAR_API_KEY",
    description: "Google Calendar API key for calendar integration",
    service: "Google Calendar",
  },
  {
    name: "OPENAI_API_KEY",
    description: "OpenAI API key for enhanced AI features",
    service: "OpenAI",
  },
  {
    name: "SUPABASE_URL",
    description: "Supabase project URL for cloud storage",
    service: "Supabase",
  },
  {
    name: "SUPABASE_ANON_KEY",
    description: "Supabase anonymous key",
    service: "Supabase",
  },
]

/**
 * Load environment variables from .env files
 */
function loadEnvFiles() {
  const envFiles = [".env.local", ".env.development", ".env"]
  const loadedVars = {}

  envFiles.forEach((file) => {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      log.info(`Loading environment from ${file}`)
      const content = fs.readFileSync(filePath, "utf8")

      content.split("\n").forEach((line) => {
        line = line.trim()
        if (line && !line.startsWith("#")) {
          const [key, ...valueParts] = line.split("=")
          if (key && valueParts.length > 0) {
            const value = valueParts.join("=").replace(/^["']|["']$/g, "")
            loadedVars[key.trim()] = value
            process.env[key.trim()] = value
          }
        }
      })
    }
  })

  return loadedVars
}

/**
 * Validate required environment variables
 */
function validateRequired() {
  log.header("\n🔍 Validating Required Environment Variables")

  const missing = []
  const warnings = []

  requiredEnvVars.forEach((envVar) => {
    const value = process.env[envVar.name]

    if (!value) {
      if (envVar.required) {
        missing.push(envVar)
      } else {
        warnings.push(envVar)
      }
    } else {
      log.success(`${envVar.name}: ${value}`)
    }
  })

  return { missing, warnings }
}

/**
 * Check optional environment variables
 */
function checkOptional() {
  log.header("\n⚙️  Optional Environment Variables")

  optionalEnvVars.forEach((envVar) => {
    const value = process.env[envVar.name]

    if (value) {
      log.success(`${envVar.name}: ${value}`)
    } else {
      log.info(`${envVar.name}: Using default (${envVar.defaultValue})`)
    }
  })
}

/**
 * Check external service configurations
 */
function checkExternalServices() {
  log.header("\n🌐 External Service Integrations")

  const configuredServices = new Set()

  externalServiceVars.forEach((envVar) => {
    const value = process.env[envVar.name]

    if (value) {
      log.success(`${envVar.name}: Configured ✓`)
      configuredServices.add(envVar.service)
    } else {
      log.info(`${envVar.name}: Not configured (optional)`)
    }
  })

  if (configuredServices.size > 0) {
    log.success(`\nConfigured services: ${Array.from(configuredServices).join(", ")}`)
  } else {
    log.info("\nNo external services configured (app will work offline)")
  }
}

/**
 * Validate Node.js and npm versions
 */
function validateNodeEnvironment() {
  log.header("\n🔧 Node.js Environment")

  const nodeVersion = process.version
  const majorVersion = Number.parseInt(nodeVersion.slice(1).split(".")[0])

  if (majorVersion >= 18) {
    log.success(`Node.js version: ${nodeVersion} ✓`)
  } else {
    log.error(`Node.js version: ${nodeVersion} (requires 18+)`)
    return false
  }

  try {
    const { execSync } = require("child_process")
    const npmVersion = execSync("npm --version", { encoding: "utf8" }).trim()
    log.success(`npm version: ${npmVersion} ✓`)
  } catch (error) {
    log.error("npm not found or not working properly")
    return false
  }

  return true
}

/**
 * Check project dependencies
 */
function checkDependencies() {
  log.header("\n📦 Project Dependencies")

  const packageJsonPath = path.join(process.cwd(), "package.json")

  if (!fs.existsSync(packageJsonPath)) {
    log.error("package.json not found")
    return false
  }

  const nodeModulesPath = path.join(process.cwd(), "node_modules")

  if (!fs.existsSync(nodeModulesPath)) {
    log.warning('node_modules not found - run "npm install"')
    return false
  }

  log.success("package.json found ✓")
  log.success("node_modules found ✓")

  return true
}

/**
 * Generate .env.local template if it doesn't exist
 */
function generateEnvTemplate() {
  const envLocalPath = path.join(process.cwd(), ".env.local")

  if (!fs.existsSync(envLocalPath)) {
    log.header("\n📝 Generating .env.local template")

    const template = `# Ultra-Advanced To-Do List Configuration
# Generated on ${new Date().toISOString()}

# Application Settings
NEXT_PUBLIC_APP_NAME="Ultra Todo"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Settings
NODE_ENV=development
NEXT_PUBLIC_DEV_MODE=true

# 3D Rendering Settings
NEXT_PUBLIC_WEBGL_DEBUG=false
NEXT_PUBLIC_THREE_DEBUG=false

# Voice Recognition Settings
NEXT_PUBLIC_VOICE_ENABLED=true
NEXT_PUBLIC_SPEECH_LANG=en-US

# Performance Settings
NEXT_PUBLIC_PERFORMANCE_MONITORING=false

# Optional: External API Keys (uncomment and add your keys)
# GOOGLE_CALENDAR_API_KEY=your_api_key_here
# OPENAI_API_KEY=your_api_key_here
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_key
`

    fs.writeFileSync(envLocalPath, template)
    log.success(".env.local template created")
    return true
  }

  return false
}

/**
 * Main validation function
 */
function main() {
  console.log(`${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                Environment Validation Script                 ║
║              Ultra-Advanced To-Do List                      ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`)

  // Load environment files
  const loadedVars = loadEnvFiles()

  // Validate Node.js environment
  const nodeValid = validateNodeEnvironment()
  if (!nodeValid) {
    log.error("\n❌ Node.js environment validation failed")
    process.exit(1)
  }

  // Check dependencies
  const depsValid = checkDependencies()
  if (!depsValid) {
    log.warning("\n⚠️  Dependencies not properly installed")
  }

  // Generate .env.local if needed
  const templateGenerated = generateEnvTemplate()
  if (templateGenerated) {
    // Reload after generating template
    loadEnvFiles()
  }

  // Validate required variables
  const { missing, warnings } = validateRequired()

  // Check optional variables
  checkOptional()

  // Check external services
  checkExternalServices()

  // Final summary
  log.header("\n📋 Validation Summary")

  if (missing.length > 0) {
    log.error(`Missing required variables: ${missing.length}`)
    missing.forEach((envVar) => {
      log.error(`  • ${envVar.name}: ${envVar.description}`)
    })
    process.exit(1)
  }

  if (warnings.length > 0) {
    log.warning(`Variables using defaults: ${warnings.length}`)
    warnings.forEach((envVar) => {
      log.warning(`  • ${envVar.name}: ${envVar.description} (default: ${envVar.defaultValue})`)
    })
  }

  log.success("\n✅ Environment validation passed!")
  log.info("\nYour Ultra-Advanced To-Do List is ready to run:")
  log.info("  npm run dev    # Start development server")
  log.info("  npm run build  # Build for production")
  log.info("  npm run start  # Start production server")

  console.log(`\n${colors.green}🚀 Happy coding!${colors.reset}\n`)
}

// Run the validation
if (require.main === module) {
  main()
}

module.exports = {
  validateRequired,
  checkOptional,
  checkExternalServices,
  validateNodeEnvironment,
  checkDependencies,
}
