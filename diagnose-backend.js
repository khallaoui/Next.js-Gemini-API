#!/usr/bin/env node

const http = require('http');
const https = require('https');

console.log('🔍 Backend Diagnostic Tool');
console.log('==========================\n');

// Test different ports and endpoints
const testConfigs = [
    { host: 'localhost', port: 8080, path: '/' },
    { host: 'localhost', port: 8080, path: '/api' },
    { host: 'localhost', port: 8080, path: '/api/pensioners' },
    { host: 'localhost', port: 8080, path: '/api/affilies' },
    { host: 'localhost', port: 8080, path: '/api/allocataires' },
    { host: 'localhost', port: 8080, path: '/actuator/health' },
    { host: 'localhost', port: 9090, path: '/' }, // Alternative port
    { host: 'localhost', port: 3000, path: '/' }, // Another common port
];

async function testEndpoint(config) {
    return new Promise((resolve) => {
        const options = {
            hostname: config.host,
            port: config.port,
            path: config.path,
            method: 'GET',
            timeout: 3000,
            headers: {
                'User-Agent': 'Backend-Diagnostic-Tool'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    success: true,
                    status: res.statusCode,
                    headers: res.headers,
                    data: data.substring(0, 200) // First 200 chars
                });
            });
        });

        req.on('error', (err) => {
            resolve({
                success: false,
                error: err.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                error: 'Request timeout'
            });
        });

        req.end();
    });
}

async function runDiagnostics() {
    console.log('Testing backend connectivity...\n');

    for (const config of testConfigs) {
        const url = `http://${config.host}:${config.port}${config.path}`;
        process.stdout.write(`Testing ${url}... `);
        
        const result = await testEndpoint(config);
        
        if (result.success) {
            console.log(`✅ Status: ${result.status}`);
            if (result.status === 200 && result.data) {
                console.log(`   Response preview: ${result.data.replace(/\n/g, ' ').substring(0, 100)}...`);
            }
        } else {
            console.log(`❌ ${result.error}`);
        }
    }

    console.log('\n📋 Diagnostic Summary:');
    console.log('======================');
    console.log('If you see ❌ for all endpoints:');
    console.log('  → Your Spring Boot backend is not running');
    console.log('  → Start it with: mvn spring-boot:run or ./mvnw spring-boot:run');
    console.log('');
    console.log('If you see ✅ for port 8080 but 404 for /api endpoints:');
    console.log('  → Backend is running but missing API endpoints');
    console.log('  → Check your Spring Boot controllers');
    console.log('');
    console.log('If you see ✅ for different port:');
    console.log('  → Update your .env file with the correct port');
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure Spring Boot is running');
    console.log('2. Check Spring Boot console for startup errors');
    console.log('3. Verify your controllers are properly annotated');
    console.log('4. Test endpoints manually with curl or Postman');
}

runDiagnostics().catch(console.error);