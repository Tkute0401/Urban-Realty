/**
 * Import Verification Script for Squarefooot
 * Verifies that all TypeScript path aliases can be resolved
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'new-nextjs-app', 'src');

function checkImports(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const importLines = content.match(/import.*from\s+['"]@\/[^'"]+['"]/g) || [];
        
        const issues = [];
        
        importLines.forEach(line => {
            const match = line.match(/from\s+['"](@\/[^'"]+)['"]/);
            if (match) {
                const importPath = match[1];
                // Convert @/ to src/
                const actualPath = importPath.replace('@/', '');
                const fullPath = path.join(srcDir, actualPath);
                
                // Check for common extensions
                const extensions = ['.ts', '.tsx', '.js', '.jsx'];
                let exists = false;
                
                for (const ext of extensions) {
                    if (fs.existsSync(fullPath + ext)) {
                        exists = true;
                        break;
                    }
                }
                
                // Also check if it's a directory with index file
                if (!exists && fs.existsSync(fullPath)) {
                    for (const ext of extensions) {
                        if (fs.existsSync(path.join(fullPath, 'index' + ext))) {
                            exists = true;
                            break;
                        }
                    }
                }
                
                if (!exists) {
                    issues.push({
                        file: filePath,
                        import: importPath,
                        resolvedPath: fullPath
                    });
                }
            }
        });
        
        return issues;
    } catch (error) {
        console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
        return [];
    }
}

function walkDirectory(dir, issues = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            walkDirectory(filePath, issues);
        } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
            const fileIssues = checkImports(filePath);
            issues.push(...fileIssues);
        }
    });
    
    return issues;
}

function main() {
    console.log('🔍 Verifying imports in Squarefooot Next.js app...\n');
    
    if (!fs.existsSync(srcDir)) {
        console.error(`❌ Source directory not found: ${srcDir}`);
        process.exit(1);
    }
    
    const issues = walkDirectory(srcDir);
    
    if (issues.length === 0) {
        console.log('✅ All imports verified successfully!');
        console.log('🚀 No import resolution issues found.');
    } else {
        console.log(`❌ Found ${issues.length} import resolution issue(s):\n`);
        
        issues.forEach(issue => {
            console.log(`File: ${path.relative(process.cwd(), issue.file)}`);
            console.log(`Import: ${issue.import}`);
            console.log(`Resolved to: ${issue.resolvedPath}`);
            console.log('---');
        });
        
        console.log('\n🔧 Please fix these import issues before deploying to Railway.');
    }
}

main();