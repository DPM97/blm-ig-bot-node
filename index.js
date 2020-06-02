const color = require('colorthief');
const request = require('request');
const config = require('./config');
const ig = require('node-instagram');
const nc = require('node-cache');
const Cache = new nc();

const main = async () => {
    let f = setInterval(() => {

    }, config.delay * 1000)
}

const getRecent = async () => {
    request({
        uri: "https://www.instagram.com/explore/tags/blm/",
        method: "GET",
        headers: {

        }
    }, async (err, resp, body) => {
        let res = await body.match(/(?<="display_url":"\s*).*?(?=\s*",")/gs)
        let codes = await body.match(/(?<="shortcode":"\s*).*?(?=\s*",")/gs)
        let o = { }
        await res.forEach(async (url, i) => {
            o[`${codes[i]}`] = { url: url.replace(/\\u0026/g, '&'), post: codes[i] }
        })
        return handleRecent(o);
    })
}

const handleRecent = async (recent) => {
    for (const key in recent) {
        let c = await getAvgColor(recent[key].url);
        if (c >= config.threshold || await Cache.get(key) == undefined) {
            delete recent[key]
        } else {
            await Cache.set(key, recent[key], config.cacheTTL);
        }
    }
    console.log(Object.keys(recent).length)
}

const getAvgColor = async (url) => {
    return new Promise(async (resolve, reject) => {
        await color.getPalette(url, 20).then(main => {
            let avg = 0;
            main.forEach(c => {
                let innerAvg = 0;
                c.forEach(co => {
                    innerAvg += co
                })
                innerAvg /= 3;
                avg += innerAvg;
            })
            avg /= main.length
            resolve(avg)
        }).catch(e => {
            console.log(e)
            reject(e)
        });
    });
}
return getRecent();
getColor('https://instagram.fbed1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/101791770_118662563195952_7472917913200648238_n.jpg?_nc_ht=instagram.fbed1-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=7v2ydLJDYNMAX_iE8IH&oh=8ebfe671c16d83e2d65d0d83a3564e49&oe=5F01AC31')
getColor('https://instagram.fbed1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.157.1440.1440a/s640x640/101829795_2759102304199143_8371549032704102899_n.jpg?_nc_ht=instagram.fbed1-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=yWC2fF0VwkcAX9ClMKr&oh=b22997de9f06c99bda262e0e8a8548c0&oe=5F010F9F')
getColor('https://instagram.fbed1-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/s640x640/102427536_2665439173714536_3865768100993708298_n.jpg?_nc_ht=instagram.fbed1-1.fna.fbcdn.net&_nc_cat=100&_nc_ohc=BW93KzEZH94AX9JxXtm&oh=41ff619e2c4867c706658ba39ae5c6b3&oe=5EFFC8B1')