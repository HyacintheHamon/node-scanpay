/*
    help@scanpay.dk || irc.scanpay.dk:6697 || scanpay.dk/slack
*/
const apikey = '1153:YHZIUGQw6NkCIYa3mG6CWcgShnl13xuI7ODFUYuMy0j790Q6ThwBEjxfWFXwJZ0W';
const scanpay = require('../')(apikey);

const options = {
    hostname: 'api.test.scanpay.dk'
};

// First test: Get the maximum seq
scanpay.maxSeq(options).then((res) => {
    console.log('Max seq result: ' + JSON.stringify(res));
}).catch(e => console.log(e));

// Second test: Apply changes since last seq call
let dbseq = 5; // Stored in the shop database after last seq.
async function applyChanges() {
    // Loop through all changes
    while (1) {
        let res;
        try {
            res = await scanpay.seq(dbseq, options);
        } catch (e) {
            console.log(e);
            return;
        }
        // Apply some changes ... and update dbseq after
        for (const change of res.changes) {
            console.log(JSON.stringify(change, null, 4));
            console.log('#' + change.orderid + ' updated to revision ' + change.rev);
        }
        if (res.seq > dbseq) {
            console.log('Updating seq to ' + res.seq);
            dbseq = res.seq;
        }

        // Break when there are no more changes
        if (res.changes.length === 0) {
            console.log('Done applying changes, new seq is ' + dbseq);
            return;
        }
    }
}
applyChanges();

