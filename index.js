const color = require('colorthief');
const request = require('request');
const config = require('./config');
const ig = require('node-instagram');
const nc = require('node-cache');
const Cache = new nc();
const fs = require('fs');
let proxies = [];

const main = async () => {
    await fs.readFile('proxies.txt', 'utf-8', (err, out) => { proxies = out.split('\r\n') })
    await getRecent();
    let f = setInterval(async () => {
        getRecent();
    }, config.delay * 1000)
}

const getRecent = async () => {
    request({
        uri: "https://www.instagram.com/explore/tags/blm/",
        method: "GET",
        proxy: await proxyLogic()
    }, async (err, resp, body) => {
        if (err || resp.statusCode != 200) {
            return getRecent()
        } else {
            let res = await body.match(/(?<="display_url":"\s*).*?(?=\s*",")/gs)
            let codes = await body.match(/(?<="shortcode":"\s*).*?(?=\s*",")/gs)
            let o = { }
            await res.forEach(async (url, i) => {
                o[`${codes[i]}`] = { url: url.replace(/\\u0026/g, '&'), post: codes[i] }
            })
            return handleRecent(o);
        }
    })
}

const handleRecent = async (recent) => {
    for (const key in recent) {
        let c = await getAvgColor(recent[key].url);
        if (c >= config.threshold || await Cache.get(key) != undefined) {
            delete recent[key]
        } else {
            await Cache.set(key, recent[key], config.cacheTTL);
            send(key);
        }
    }
}

const send = async (id) => {
    request({
        url: "https://us-central1-protect-blm.cloudfunctions.net/post",
        method: "POST",
        body: {
            id: id
        },
        json: true,
    }, (err, res, body) => { if (err) console.log(err) })
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

const proxyLogic = async (url) => {
    return new Promise(async (resolve, reject) => {
      if (proxies.length == 0) {
          resolve('')
      } else {
          let p = proxies[Math.random() * proxies.length | 0]
          p = p.split(':')
          resolve(`http://${p[2]}:${p[3]}@${p[0]}:${p[1]}`)
      }
    })
}


main();