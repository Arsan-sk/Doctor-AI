#!/usr/bin/env node

/**
 * AI Doctor - System Diagnostic Script
 * Checks all configuration and dependencies before starting
 * 
 * Run with: node scripts/diagnostic.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

// Status symbols
const symbols = {
    pass: `${colors.green}✅${colors.reset}`,
    fail: `${colors.red}❌${colors.reset}`,
    warn: `${colors.yellow}⚠️ ${colors.reset}`,
    info: `${colors.cyan}ℹ️ ${colors.reset}`,
};

console.log(`
${colors.blue}╔════════════════════════════════════════════╗${colors.reset}
${colors.blue}║  🩺 AI Doctor - System Diagnostic Tool   ║${colors.reset}
${colors.blue}╚════════════════════════════════════════════╝${colors.reset}
`);

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function check(name, condition, message = '') {
    if (condition === true) {
        console.log(`${symbols.pass} ${name}${message ? ': ' + message : ''}`);
        passCount++;
    } else if (condition === false) {
        console.log(`${symbols.fail} ${name}${message ? ': ' + message : ''}`);
        failCount++;
    } else {
        // Treat as warning
        console.log(`${symbols.warn} ${name}${message ? ': ' + message : ''}`);
        warnCount++;
    }
}

// Load environment variables
console.log(`\n${colors.cyan}📋 CHECKING ENVIRONMENT VARIABLES${colors.reset}`);
console.log('━'.repeat(45));

const envPath = path.join(projectRoot, '.env');
const envExamplePath = path.join(projectRoot, '.env.example');

check('✓ .env file exists', fs.existsSync(envPath), envPath);

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    dotenv.config({ path: envPath });

    const requiredVars = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'JWT_SECRET',
        'JWT_EXPIRY',
    ];

    requiredVars.forEach(varName => {
        const value = process.env[varName];
        const isDefined = !!value;
        const isPlaceholder = value && (value.includes('your-') || value.includes('placeholder'));
        
        if (isDefined && !isPlaceholder) {
            check(`✓ ${varName}`, true, 'configured');
        } else if (isDefined && isPlaceholder) {
            check(`✓ ${varName}`, 'warning', 'contains placeholder - update it!');
        } else {
            check(`✓ ${varName}`, false, 'MISSING - required!');
        }
    });

    const optionalVars = [
        'NODE_ENV',
        'PORT',
        'HOST',
        'SESSION_SECRET',
        'CORS_ORIGIN',
    ];

    console.log(`\n${colors.cyan}Optional Variables:${colors.reset}`);
    optionalVars.forEach(varName => {
        const value = process.env[varName];
        check(`  • ${varName}`, !!value, value || '(using default)');
    });
}

// Check file structure
console.log(`\n${colors.cyan}📁 CHECKING PROJECT STRUCTURE${colors.reset}`);
console.log('━'.repeat(45));

const requiredDirs = [
    'backend',
    'backend/routes',
    'backend/utils',
    'backend/middleware',
    'frontend',
    'frontend/js',
    'database',
];

requiredDirs.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    check(`✓ ${dir}/ directory`, fs.existsSync(dirPath), dirPath);
});

const requiredFiles = [
    'backend/server.js',
    'backend/config.js',
    'backend/routes/cart.js',
    'backend/routes/auth.js',
    'backend/utils/db.js',
    'frontend/index.html',
    'frontend/js/app.js',
    'frontend/js/api.js',
    'frontend/js/persistent-cart.js',
    'package.json',
];

requiredFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    check(`✓ ${file}`, fs.existsSync(filePath), filePath);
});

// Check JavaScript files for critical code
console.log(`\n${colors.cyan}🔍 CHECKING CODE INTEGRITY${colors.reset}`);
console.log('━'.repeat(45));

// Check persistent-cart.js for field names
const persistentCartPath = path.join(projectRoot, 'frontend/js/persistent-cart.js');
if (fs.existsSync(persistentCartPath)) {
    const content = fs.readFileSync(persistentCartPath, 'utf-8');
    
    check('✓ camelCase field: medicineName', 
        content.includes('medicineName'), 
        'frontend uses correct field names');
    
    check('✓ camelCase field: pricePerUnit', 
        content.includes('pricePerUnit'), 
        'frontend uses correct field names');
    
    check('✓ updateCartUI export', 
        content.includes('updateCartUI,') && content.includes('export default'), 
        'function is exported');
    
    check('✓ Cart reload after operations', 
        content.includes('getItems()') && content.includes('await api'), 
        'cart reloads after modifications');
}

// Check backend route for field conversion
const cartRoutePath = path.join(projectRoot, 'backend/routes/cart.js');
if (fs.existsSync(cartRoutePath)) {
    const content = fs.readFileSync(cartRoutePath, 'utf-8');
    
    check('✓ Backend validates medicineName', 
        content.includes('medicineName') || content.includes('medicine_name'), 
        'input validation present');
    
    check('✓ Backend converts to snake_case', 
        content.includes('medicine_name') && content.includes(':'), 
        'field conversion for database');
}

// Check database schema
console.log(`\n${colors.cyan}🗄️  CHECKING DATABASE SCHEMA${colors.reset}`);
console.log('━'.repeat(45));

const schemaPath = path.join(projectRoot, 'database/schema.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    check('✓ cart_items table defined', 
        schema.includes('CREATE TABLE') && schema.includes('cart_items'), 
        'database schema includes cart table');
    
    check('✓ medicine_name column', 
        schema.includes('medicine_name'), 
        'cart table has medicine_name column');
    
    check('✓ price_per_unit column', 
        schema.includes('price_per_unit'), 
        'cart table has price_per_unit column');
    
    check('✓ quantity constraint', 
        schema.includes('CHECK') && schema.includes('quantity'), 
        'quantity validation in database');
}

// Check migration file
const migrationPath = path.join(projectRoot, 'database/fix_rls_migration.sql');
check('✓ RLS fix migration exists', 
    fs.existsSync(migrationPath), 
    migrationPath);

// Dependencies check
console.log(`\n${colors.cyan}📦 CHECKING DEPENDENCIES${colors.reset}`);
console.log('━'.repeat(45));

const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    
    const requiredDeps = [
        'express',
        'dotenv',
        'cors',
        '@supabase/supabase-js',
        'jsonwebtoken',
        'bcryptjs',
    ];

    requiredDeps.forEach(dep => {
        const hasDeep = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
        check(`✓ ${dep}`, !!hasDeep, hasDeep ? packageJson.dependencies[dep] : 'MISSING');
    });

    // Check if node_modules exists
    const nodeModulesPath = path.join(projectRoot, 'node_modules');
    check('✓ node_modules installed', 
        fs.existsSync(nodeModulesPath), 
        'dependencies installed');
}

// Summary
console.log(`\n${colors.cyan}📊 DIAGNOSTIC SUMMARY${colors.reset}`);
console.log('━'.repeat(45));

const total = passCount + failCount + warnCount;
const passRate = ((passCount / total) * 100).toFixed(1);

console.log(`
${symbols.pass} Passed:  ${passCount}/${total}
${symbols.fail} Failed:  ${failCount}/${total}
${symbols.warn} Warnings: ${warnCount}/${total}

Success Rate: ${passRate}%
`);

if (failCount === 0 && warnCount === 0) {
    console.log(`${colors.green}🎉 ALL CHECKS PASSED! You're ready to start.${colors.reset}\n`);
    console.log('Start the server with: npm run dev\n');
} else if (failCount === 0) {
    console.log(`${colors.yellow}⚠️  WARNINGS FOUND - Please review above.${colors.reset}\n`);
    console.log('You can still try: npm run dev\n');
} else {
    console.log(`${colors.red}❌ CRITICAL ISSUES FOUND - Fix them before starting.${colors.reset}\n`);
    console.log('Follow the COMPLETE_SETUP_GUIDE.md for solutions.\n');
    process.exit(1);
}

// Recommendations
console.log(`${colors.cyan}💡 RECOMMENDATIONS:${colors.reset}`);
console.log('━'.repeat(45));

if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')) {
    console.log('   1. Get your Service Role Key from Supabase Settings → API');
    console.log('      Update SUPABASE_SERVICE_ROLE_KEY in .env\n');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('your-')) {
    console.log('   2. Update JWT_SECRET in .env (min 32 characters)');
    console.log(`      Current: ${process.env.JWT_SECRET?.substring(0, 30)}...\n`);
}

console.log('   3. Run the RLS migration in Supabase SQL Editor');
console.log('      See FINAL_ACTION_PLAN.md for the SQL code\n');

console.log('   4. After changes, run: npm install && npm run dev\n');

console.log(`For more help, see: COMPLETE_SETUP_GUIDE.md\n`);
