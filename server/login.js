const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // Necessário para criptografar senhas

// Configurações de conexão (use as mesmas que você tem)
const connectionConfig = {
    user: 'model_user', 
    host: 'localhost',
    database: 'model', 
    password: '6bhcct53', 
    port: 3306, 
};

async function injectUserToTable() {
    let connection;
    try {
        connection = await mysql.createConnection(connectionConfig);
        console.log('✅ Connection established for injector.');

        // --- 1. COMANDO CREATE TABLE (Corrigido e Segurado) ---
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uk_email (email)
            );
        `;
        await connection.execute(createTableSQL);
        console.log('Table "users" checked/created successfully.');
        

        // --- 2. COMANDO INSERT PARA INJETAR UM NOVO USUÁRIO ---
        
        const plainPassword = 'password123';
        // Gerar o hash da senha (processo de criptografia)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        
        const userName = 'Admin Tester';
        const userEmail = 'test@example.com';

        const insertSQL = `
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
        `;
        
        const [insertResult] = await connection.execute(insertSQL, [userName, userEmail, hashedPassword]);
        
        console.log(`\n✅ User "${userEmail}" injected successfully.`);
        console.log(`   - ID Inserido: ${insertResult.insertId}`);
        console.log(`   - Senha Original: ${plainPassword}`);
        console.log(`   - Senha Criptografada (Hash): ${hashedPassword}`);

    } catch (err) {
        // Se a tabela já existir e o e-mail for duplicado, o MySQL lançará um erro,
        // mas o script não quebrará por sintaxe.
        if (err.code === 'ER_DUP_ENTRY') {
            console.warn(`\n⚠️ User injection failed: Email "${userEmail}" already exists.`);
        } else {
            console.error('\n❌ Error during SQL execution:', err.message);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

injectUserToTable();