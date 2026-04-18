const fetch = require('node-fetch');

async function testProjectFetch() {
    const token = 'YOUR_TOKEN'; // I'll need to use the user's token in reality
    const projectId = 'bd6b4092-22cd-4adc-b97a-fffa812725b9'; // Example ID from logs
    
    try {
        const res = await fetch(`http://127.0.0.1:8000/projects/${projectId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}
