Number.prototype.mod = function(n) {
    return ((this%n)+n)%n
}

// Initiallizing global variables

let root = 48
let instr = []

const ctx = new(window.AudioContext || window.webkitAudioContext)()
const player= new WebAudioFontPlayer()

// Plays a soundfont tone with the loaded instrument
function sfTone(instrument, pitch, time, duration, volume, pan) {
    const t = time || ctx.currentTime
    const dur = duration || 1
    const p = pitch || 48
    const vol = volume || 1
    const stereo = pan || 0
    const panNode = new StereoPannerNode(ctx, {
        'pan' : stereo
    })
    panNode.connect(ctx.destination)
    player.loader.decodeAfterLoading(ctx, instrument)
    player.queueWaveTable(ctx, panNode, instrument, t, p, dur, vol)
}

// Instrument soundfonts used
const piano = {
    'path' : 'https://surikov.github.io/webaudiofontdata/sound/0000_GeneralUserGS_sf2_file.js',
    'name' : '_tone_0000_GeneralUserGS_sf2_file',
    'ref' : 'Piano'
}
const hihat = {
    'path' : 'https://surikov.github.io/webaudiofontdata/sound/12844_0_Chaos_sf2_file.js',
    'name' : '_drum_44_0_Chaos_sf2_file',
    'ref' : 'Hi-Hat'
}
const ride = {
    'path' : 'https://surikov.github.io/webaudiofontdata/sound/12851_0_Chaos_sf2_file.js',
    'name' : '_drum_51_0_Chaos_sf2_file',
    'ref' : 'Ride Cymbal'
}
const violin = {
    'path' : 'https://surikov.github.io/webaudiofontdata/sound/0401_FluidR3_GM_sf2_file.js',
    'name' : '_tone_0401_FluidR3_GM_sf2_file',
    'ref' : 'Violin'
}
const cello = {
    'path' : 'https://surikov.github.io/webaudiofontdata/sound/0420_FluidR3_GM_sf2_file.js',
    'name' : '_tone_0420_FluidR3_GM_sf2_file',
    'ref' : 'Cello'
}
const clarinet = {
    'path' : 'https://surikov.github.io/webaudiofontdata/sound/0710_SBLive_sf2.js',
    'name' : '_tone_0710_SBLive_sf2',
    'ref' : 'Clarinet'
}

// Loads all instruments upon loading the page
function loadInstruments(instruments) {
    for(let i = 0; i<instruments.length; i++) {
        let curr = instruments[i]
        player.loader.startLoad(ctx, curr.path, curr.name)
        player.loader.waitLoad(function() {
            instr[i] = window[curr.name]
            player.loader.decodeAfterLoading(ctx, curr.name)
        })
    }
}
loadInstruments([hihat, ride, piano, violin, cello, clarinet])

//////////////////////////////////////////////////////////////

const timeValues = [1/4, 3/8, 1/2, 3/4, 1, 2, 3, 4]
const rests = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
// Initiallizing all rows
let P_0 = []
let P_1 = []
let P_2 = []
let P_3 = []
let P_4 = []
let P_5 = []
let P_6 = []
let P_7 = []
let P_8 = []
let P_9 = []
let P_10 = []
let P_11 = []

let I_0 = []
let I_1 = []
let I_2 = []
let I_3 = []
let I_4 = []
let I_5 = []
let I_6 = []
let I_7 = []
let I_8 = []
let I_9 = []
let I_10 = []
let I_11 = []

let R_0 = []
let R_1 = []
let R_2 = []
let R_3 = []
let R_4 = []
let R_5 = []
let R_6 = []
let R_7 = []
let R_8 = []
let R_9 = []
let R_10 = []
let R_11 = []

let RI_0 = []
let RI_1 = []
let RI_2 = []
let RI_3 = []
let RI_4 = []
let RI_5 = []
let RI_6 = []
let RI_7 = []
let RI_8 = []
let RI_9 = []
let RI_10 = []
let RI_11 = []

let T_Rows = [P_0, P_1, P_2, P_3, P_4, P_5, P_6, P_7, P_8, P_9, P_10, P_11]
let I_Rows = [I_0, I_1, I_2, I_3, I_4, I_5, I_6, I_7, I_8, I_9, I_10, I_11]
let R_Rows = [R_0, R_1, R_2, R_3, R_4, R_5, R_6, R_7, R_8, R_9, R_10, R_11]
let RI_Rows = [RI_0, RI_1, RI_2, RI_3, RI_4, RI_5, RI_6, RI_7, RI_8, RI_9, RI_10, RI_11]
let grid = [T_Rows, I_Rows, R_Rows, RI_Rows]

function transposeRow(row, interval) {
    let result = []
    for (let i = 0; i < row.length; i++){
        result.push((row[i] + interval).mod(12))
    }
    return result
}

function findIntervals(row) {
    let result = []
    for (let i = 0; i < row.length; i++){
        result.push((row[(i+1).mod(12)] - row[i]))
    }
    return result
}

function invertRow(row) {
    let intervals = findIntervals(row)
    let result = [row[0]]
    for (let i = 1; i < row.length; i++){
        result.push((result[i-1] - intervals[i-1]).mod(12)) 
    }
    return result
}

function retrogradeRow(row) {
    let temp = row.slice()
    return temp.reverse()
}

function fillRows(row) {
    let invRow = invertRow(row)
    let retro = retrogradeRow(row)
    let riRow = retrogradeRow(invRow)
    for (let i = 0; i < row.length; i++) {
        T_Rows[i] = transposeRow(row, i)
        I_Rows[i] = transposeRow(invRow, i)
        R_Rows[i] = transposeRow(retro, i)
        RI_Rows[i] = transposeRow(riRow, i)
    }
}

let testarray = [0,4,3,2,11,1,5,6,7,10,8,9]
fillRows(testarray)

function determineRowType (num) {
    let n
    switch(num) {
        case 0:
            n = 'P_'
            break;
        case 1:
            n = 'I_'
            break;
        case 2:
            n = 'R_'
            break;
        case 3:
            n = 'RI_'
            break;
        default:
            'error'
    }
    return n
}

function rowToString (row) {
    let ret = []
    for (let i = 0; i < row.length; i++) {
        switch(row[i]) {
            case 0:
                ret.push('0, C')
                break;
            case 1:
                ret.push('1, C#')
                break;
            case 2:
                ret.push('2, D')
                break;
            case 3:
                ret.push('3, D#')
                break;
            case 4:
                ret.push('4, E')
                break;
            case 5:
                ret.push('5, F')
                break;
            case 6:
                ret.push('6, F#')
                break;
            case 7:
                ret.push('7, G')
                break;
            case 8:
                ret.push('8, G#')
                break;
            case 9:
                ret.push('9, A')
                break;
            case 10:
                ret.push('T, A#')
                break;
            case 11:
                ret.push('E, B')
                break;
            default:
                console.log('error')
        }
    }
    return ret
}

function pickRow (g) {
    let type = Math.floor(Math.random()*3.999999)
    let row = Math.floor(Math.random()*11.999999)
    let n = determineRowType(type)
    let ret = {
        'r' : g[type][row],
        'name' : n+row.toString()
    }
    return ret
}

function findHexRows(r, g) {
    let lastHalf = r.slice(6)
    let checker = (arr, target) => target.every(v => arr.includes(v))
    let hexRows = []
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 12; j++) {
            if (checker(lastHalf, g[i][j].slice(0,6))) {
                console.log(g[i][j])
                let n = determineRowType(i)
                let ret = {
                    'r' : g[i][j],
                    'name' : n+j.toString()
                }
                hexRows.push(ret)
            }
        }
    }
    console.log('Rows with hexachordal combinatoriality:', hexRows)
    return hexRows
}

// array shuffle algo based on Fisher-Yates; found on stackoverflow
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

function playRow( row, instrArray, tempo, numRows, register, range, restTime, hex, timeConstraint ) {
    
    fillRows(row)
    let hexRows = findHexRows(row, grid)
    let instrIndex = 0
    let volume = 1
    let loops = numRows || 1
    root = 24 + register*12
    let rangeArray = Array.from(Array(range).keys())
    let pan = 0
    let time = ctx.currentTime
    let temp = tempo || 120
    let beat = 60/temp
    let rest_length = restTime || 1
    
    let timeAdj = 1
    if (timeConstraint) {
        let total_dur = beat*textArray.length
        timeAdj = timeConstraint/total_dur
    }

    let timeout
    let curr_time = ctx.currentTime
    for (let x = 0; x < instr.length; x++) {
        if (instrArray[x] === true) {
            let selectedPreset = instr[x]
            switch (x) {
                case 0:
                    for (let j = 0; j < loops; j++) { 

        }
    }
    for (let j = 0; j < loops; j++) {
        let curr_row = pickRow(grid)
        let curr_row_name = curr_row.name
        timeout = (function(n, r) {   
            setTimeout(function() {
                console.log('playing: ' + n)
                console.log(rowToString(r))
            }, Math.round((time-curr_time)*1000))
        }) (curr_row_name, curr_row.r)
        for (let i = 0; i < 12; i++) {
            let t = timeValues[Math.floor(Math.random() * timeValues.length)]
            let r = rests[Math.floor(Math.random() * rests.length)]
            let ran = rangeArray[Math.floor(Math.random() * rangeArray.length)]
            dur = beat*t
            let pitch
            if (instrIndex === 0) pitch = 44
            else pitch = root + curr_row.r[i] + ran*12
            sfTone(selectedPreset, pitch, time, dur, volume, pan)
            let rest = rest_length*beat*r*timeValues[Math.floor(Math.random() * timeValues.length)]
            time += (dur + rest)

        }
    }
}

// // Wraps all the functions needed to read and play tweets from JSON files
// // in one conveninent function that is then exposed to the rest of the files
// // to be used in main.js;
// // Returns the running tally of the globalSentiment so that main can also
// // track that value and have it affect various characteristics of the visuals
// // module.exports = function run(file, tempo, timeConstraint, swing) {
// //     let twt = parseJSONtext(file)
// //     playText(twt, tempo, timeConstraint, swing)
// //     return [globalSentiment, twt.snt.comparative]
// // }

// function adsr (opts) {
//     const param = opts.param
//     const vol = opts.vol || 1
//     const peak = opts.peak || vol * 1
//     const hold = opts.hold || vol * 0.7
//     const time = opts.time || ctx.currentTime
//     const duration = opts.duration || 1
//     const a = opts.attack || duration * 0.1 
//     const d = opts.decay || duration * 0.05
//     const s = opts.sustain || duration * 0.7
//     const r = opts.release || duration * 0.15
//     const initVal = param.value
//     param.setValueAtTime(initVal, time)
//     param.exponentialRampToValueAtTime(peak, time+a)
//     param.exponentialRampToValueAtTime(hold, time+a+d)
//     param.exponentialRampToValueAtTime(hold, time+a+d+s)
//     param.exponentialRampToValueAtTime(0.0001, time+a+d+s+r)
// }

// function step (rootFreq, steps) {
//     let tr2 = Math.pow(2, 1/12)
//     let rnd = rootFreq * Math.pow(tr2, steps)
//     return Math.round(rnd * 100)/100
// }

// let testPrimeRow = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

// function transposeRow(row, interval) {
//     let result = []
//     for (let i = 0; i < row.length; i++){
//         result.push((row[i] + interval).mod(12))
//     }
//     return result
// }

// function findIntervals(row) {
//     let result = []
//     for (let i = 0; i < row.length; i++){
//         result.push((row[(i+1).mod(12)] - row[i]))
//     }
    
//     return result
// }

// function invertRow(row) {
//     let intervals = findIntervals(row)
//     let result = [row[0]]
//     for (let i = 1; i < row.length; i++){
//         result.push((result[i-1] - intervals[i-1]).mod(12)) 
//     }
//     return result
// }

// function retrogradeRow(row) {
//     return row.reverse()
// }

// const timeValues = [1/8, 1/4, 3/8, 1/2, 3/4, 1, 2, 3, 4, 6, 8]


// // the rest you can play around with if you want
// // root = starting note in MIDI (between 0-127)
// // scale = the scale that it chooses notes from (you can look at the ones i hardcoded)
// // timbre = instrument sound used and is called with instr[x] with x being 0 through 8 for right now at least
// // tempo = beats per minute, default is 120
// // timeConstraint = the numer of seconds the whole thing has to finish in, so it can apply a time adjustment to every note to fit the limit
// // volume = self explanitory float value
// // swing = boolean that if True will make the music rhythmically swing and it actually sounds pretty good lmao
// function playRows( primeRow, numRows, timbre, tempo, volume) {   
    
//     let time = ctx.currentTime
//     let temp = tempo || 120
//     let beat = 60/temp
//     let r = 48
//     let selectedPreset = timbre || instr[0]

//     let timeAdj = 1
//     let dur = beat

//     for (let i = 0; i < numRows; i++) {
//         for (let j = 0; j < primeRow.length; j++) {
//             const pitch = r+sc[ascii.mod(sc.length)]
//             sfTone(selectedPreset, pitch, time, dur, volume) 
//         }
//         if (swing) {
//             if ((i.mod(2)) === 0) {
//                 time += dur
//                 dur = swingAmount * timeAdj
//             }
//             else {
//                 time += dur
//                 dur = (beat-swingAmount) * timeAdj
//             }
//         }

//         else {
//             time += dur
//         }
//     }
// }



