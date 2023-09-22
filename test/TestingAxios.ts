
import axios from "axios"
import { LogData } from "../src/types"




(async () => {

    for (let i = 1; i < 10; i++) {
        const sendData = {
            sessionID: `${i}`, title: `${i}`, message: `${i}`, tags: [`${i}`]
        }
        await axios.post('http://localhost:3051/logger/general', sendData);
    }
})()