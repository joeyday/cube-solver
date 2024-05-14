import { Solver } from './solver.mjs'
import Cube from 'cubejs'
Cube.initSolver()

let solver = Solver(new Cube(), 2, 3)

let scrambles = Array.from({ length: 1 }, () => getScramble())

// let scrambles = [
//     "R' U' F L2 D2 B' U' D2 L' B2 L' R2 D2 R' B' D2 R2 F' U R' B' R' U' F",
//     "R' U' F R' B' L2 D2 B U2 F L2 B2 D' F' R2 B' F' L' B R D U2 R' U' F",
//     "R' U' F R2 U' L R' D2 L2 R' B2 F2 U F' L D' R' D' L' R2 F2 R' U' F"
// ]

scrambles.forEach((scramble) => {
    solver.identity()
    solver.move(scramble)

    console.log('Scramble:')
    console.log(scramble + '\n')
    
    let method = ['eo', '222', '223', 'f2l-1', '3c']
    
    let skeletons = solver.solve(...method)

    let foundCount = 0

    skeletons = skeletons.slice(0, 1)

    if (!skeletons.length) {
        console.log('DNF\n\n')
    }
    
    skeletons.forEach((skeleton) => {
        let fancySkeleton

        let totalCount = 0
        const padLength = Math.max(...skeleton.map(s => s.length));

        console.log(JSON.stringify(skeleton, null, 2))
        
        fancySkeleton = skeleton.map((alg, i) => {
            let count = (alg ? alg.split(' ').length : 0)
            totalCount += count
            return `${alg.padEnd(padLength)}  // ${method[i]} (${count}) ${totalCount}`
        })
        // .slice(0, -1) // drop the last step
        .join('\n')

        console.log('Skeleton:')
        console.log(fancySkeleton)

        console.log('\n')

        // if (fancySkeleton) {
        //     solver.identity()
        //     solver.move(scramble)
        //     skeleton.forEach((alg) => solver.move(alg))
        //     let lastStepAlgs = solver.solveStep(solver.steps['l5e'])
        //     if (lastStepAlgs.size > 1) {
        //         console.log('Skeleton:')
        //         console.log(fancySkeleton + '\n')

        //         console.log(lastStepAlgs)
        //         console.log('\n')

        //         foundCount++
        //         if (foundCount >= 10) break
        //     }
        // }
    })
})

// console.log('saving...')
// solver.saveGraphsFile()

function getScramble() {
    let cube = new Cube()
    cube.randomize()
    let optimalSolution = cube.solve()
    
    let startMoves = [
        "U", "U'", "U2", "D", "D'", "D2",
        "L", "L'", "L2", "R", "R'", "R2"
    ]
    let endMoves = [
        "U", "U'", "U2", "D", "D'", "D2",
        "F", "F'", "F2", "B", "B'", "B2"
    ]
    
    cube.identity()
    let scramble
    do {
        let startMove = startMoves[Math.floor(Math.random() * startMoves.length)]
        let endMove = endMoves[Math.floor(Math.random() * endMoves.length)]
        cube.move(`${endMove} R' U' F ${optimalSolution} R' U' F ${startMove}`)
        scramble = `R' U' F ${startMove} ${cube.solve()} ${endMove} R' U' F`
    } while (/U['2]? U|D['2]? D|F['2]? F|B['2]? B|L['2]? L|R['2]? R/.test(scramble))

    return scramble
}


