const mysql = require('mysql2/promise');

// Configurações de conexão
const connectionConfig = {
    user: 'model_user', 
    host: 'localhost',
    database: 'coursemaster', 
    password: '6bhcct53', 
    port: 3306, 
};

async function testConnection() {
    let connection;
    try {
        console.log('Attempting to connect to MySQL...');
        connection = await mysql.createConnection(connectionConfig);
        
        // Conexão bem-sucedida
        console.log('✅ Successfully connected to MySQL!');

        // Query de teste simples (Sem risco de erro de sintaxe)
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Query Result (1 + 1):', rows[0].result);

    } catch (err) {
        console.error('❌ Connection or Query Error:');
        console.error(`Message: ${err.message}`);
        console.error('HINT: Check if your MySQL service is running and credentials are correct.');
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

testConnection();