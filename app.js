const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ganti dengan API Key MapTiler milik Anda yang aktif dari https://cloud.maptiler.com/
const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY || 'YMDAElFgxA3BOhql4QGK';

// Middleware untuk menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Endpoint API Proxy untuk pencarian lokasi MapTiler
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ error: 'Parameter pencarian (q) diperlukan' });
    }

    try {
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_API_KEY}`;
        const response = await axios.get(url);

        res.json(response.data);
    } catch (error) {
        console.error('Error MapTiler API:', error.response ? error.response.data : error.message);
        const status = error.response ? error.response.status : 500;
        res.status(status).json({ 
            error: 'Gagal mengambil data dari MapTiler API',
            details: error.response ? error.response.data : error.message 
        });
    }
});

// Route utama menyajikan index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});