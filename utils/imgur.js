require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');

function uploadBase64Image(base64str) {
    return new Promise((resolve, reject) => {        
        const url = 'https://api.imgur.com/3/upload';

        // Remove meta data
        const image = base64str.replace(/^.+data:image\/\w+;base64,/, '');

        console.log('imgur >', `uploading base64 image, strlen: ${image.length}...`);

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
            .then(response => {
                console.log('imgur >', `image uploaded: ${response.data.data.link}`);
                resolve(response);
            })
            .catch(err => {
                console.error('imgur >', `error uploading image: ${err}`);
                reject(err);
            });
    });
}

function deleteImage(deleteHash) {
    return new Promise((resolve, reject) => {
        console.log('imgur >', `deleting image ${deleteHash}...`);

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
            .then(response => {
                console.log('imgur >', `image deleted ${deleteHash}`);
                resolve(response);
            })
            .catch(err => {
                console.error('imgur >', `error deleting image ${deleteHash}: ${err}`);
                reject(err);
            });
    });
}

module.exports = {
    uploadBase64Image,
    deleteImage
};
