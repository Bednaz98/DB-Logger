import { v4 } from 'uuid';
import DBLogger from '../src/Logger'

const log = new DBLogger({});

(async () => {
    const id = v4()
    for (let i = 1; i < 10; i++) {
        setTimeout(async () => { await log.general(id, "TESTING LOG", `${i}`, ["application", "second", `${i}`]) }, i * 100)
    }

})();