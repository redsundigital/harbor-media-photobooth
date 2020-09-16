require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

function uploadBase64Image(base64str) {
    return new Promise((resolve, reject) => {
        const url = 'https://api.imgur.com/3/upload';

        // Remove meta data
        const image = base64str.replace(/^.+data:image\/\w+;base64,/, '');

        const data = new FormData();
        data.append('image', image);
        data.append('type', 'base64');

        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                ...data.getHeaders()
            },
            url,
            data
        };

        axios(config)
            .then(resolve)
            .catch(reject);
    });
}

function deleteImage(deleteHash) {
    return new Promise((resolve, reject) => {
        const url = `https://api.imgur.com/3/image/${deleteHash}`;

        const data = new FormData();

        const config = {
            method: 'delete',
            headers: {
                'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
                ...data.getHeaders()
            },
            url,
            data
        }

        axios(config)
            .then(resolve)
            .catch(reject);
    });
}

module.exports = {
    uploadBase64Image,
    deleteImage
};
