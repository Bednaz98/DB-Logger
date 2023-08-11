import DBLogger from '../src'

const log = new DBLogger({});

(async () => {
    for (let i = 1; i < 10; i++) {
        setTimeout(async () => { await log.general("TESTING LOG", `${i}`, ["application", "second", `${i}`]) }, i * 100)
    }

})();