const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('discord.js-selfbot-v13');

const app = express();
app.use(express.json());
app.use(cors());

const activePorts = new Set();

app.post('/midend_login', async (req, res) => {
    const { token, port } = req.body;

    if (!token) {
        return res.send({ content: 'Missing token!' });
    } else if (!port) {
        return res.send({ content: "Missing port!"});
    }

    if (activePorts.has(port)) {
        return res.send({ content: `Port ${port} is already in use. Choose another port.` });
    }

    const client = new Client();

    client.login(token).then(() => {
            res.send({ content: `Login as: ${client.user.username} (${client.user.id})`, port: port, working: true });

            // store active port
            activePorts.add(port);

            exec(`start start.bat ${token} ${port}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Exec Error: ${error.message}`);
                    return res.send({ content: `Error: ${error.message}` });
                }
                if (stderr) {
                    console.error(`Exec Stderr: ${stderr}`);
                    return res.send({ content: `Error Stderr: ${stderr}` });
                }
            });

            client.destroy(); // Properly close the client
        }).catch(error => {
            console.log(`Invalid Token: ${error}`);
            res.send({ content: `Invalid Bot Token!`, port: port, working: false });
        });
});

app.post('/midend_logout', async (req, res) => {
    const { ip, port } = req.body;

    // remove port from active port
    activePorts.delete(port);

    try {
        await axios.post(`http://${ip}:${port}/logout`, {});
    } catch (error) {
        console.error(`Logout Error: ${error.message}`);
    }
});

app.post('/check_port', async (req, res) => {
    const { port } = req.body;

    if (!port) {
        return res.send({ content: 'Missing port!' });
    }

    // Check if the port is already in use
    if (activePorts.has(port)) {
        return res.send({ content: `Port ${port} is already in use. Choose another port.`, used: true });
    } else {
        res.send({ content: `Port ${port} is available.`, used: false });
    }
});

app.listen(5000, () => console.log('MidEnd running on port 5000'));