import Cube from 'cubejs'

export function Solver(publicCube = new Cube(), maxForwardDepth = 5, maxReverseDepth = 5) {
    /////// PRIVATE PROPERTIES ///////
    let U, R, F, D, L, B
    ;[U, R, F, D, L, B] = [0, 1, 2, 3, 4, 5]
    let UFR, UFL, UBL, UBR, DFR, DFL, DBL, DBR
    ;[UFR, UFL, UBL, UBR, DFR, DFL, DBL, DBR] = [0, 1, 2, 3, 4, 5, 6, 7]
    let UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR
    ;[UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    const oppositeMoves = { F: "B", B: "F", U: "D", D: "U", L: "R", R: "L" }

    let graphs = new Map()

    /////// PUBLIC PROPERTIES ///////
    const steps = {
        'eo': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F", "F'", "F2", "B", "B'", "B2"
            ],
            finalStates: [
                {
                    eo: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR]
                }
            ]
        },
        '222': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F2", "B2"
            ],
            finalStates: [
                {
                    ep: [UR, UF, FR],
                    co: [UFR],
                    cp: [UFR]
                },
                {
                    ep: [UF, UL, FL],
                    co: [UFL],
                    cp: [UFL]
                },
                {
                    ep: [UL, UB, BL],
                    co: [UBL],
                    cp: [UBL]
                },
                {
                    ep: [UB, UR, BR],
                    co: [UBR],
                    cp: [UBR]
                },
                {
                    ep: [DR, DF, FR],
                    co: [DFR],
                    cp: [DFR]
                },
                {
                    ep: [DF, DL, FL],
                    co: [DFL],
                    cp: [DFL]
                },
                {
                    ep: [DL, DB, BL],
                    co: [DBL],
                    cp: [DBL]
                },
                {
                    ep: [DB, DR, BR],
                    co: [DBR],
                    cp: [DBR]
                }
            ]
        },
        '223': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F2", "B2"
            ],
            finalStates: [
                {
                    ep: [UR, UF, UL, FR, FL],
                    co: [UFR, UFL],
                    cp: [UFR, UFL]
                },
                {
                    ep: [UF, UL, UB, FL, BL],
                    co: [UFL, UBL],
                    cp: [UFL, UBL]
                },
                {
                    ep: [UL, UB, UR, BL, BR],
                    co: [UBL, UBR],
                    cp: [UBL, UBR]
                },
                {
                    ep: [UB, UR, UF, BR, FR],
                    co: [UBR, UFR],
                    cp: [UBR, UFR]
                },
                {
                    ep: [DR, DF, DL, FR, FL],
                    co: [DFR, DFL],
                    cp: [DFR, DFL]
                },
                {
                    ep: [DF, DL, DB, FL, BL],
                    co: [DFL, DBL],
                    cp: [DFL, DBL]
                },
                {
                    ep: [DL, DB, DR, BL, BR],
                    co: [DBL, DBR],
                    cp: [DBL, DBR]
                },
                {
                    ep: [DB, DR, DF, BR, FR],
                    co: [DBR, DFR],
                    cp: [DBR, DFR]
                },
                {
                    ep: [UR, UF, FR, DR, DF],
                    co: [UFR, DFR],
                    cp: [UFR, DFR]
                },
                {
                    ep: [UF, UL, FL, DF, DL],
                    co: [UFL, DFL],
                    cp: [UFL, DFL]
                },
                {
                    ep: [UL, UB, BL, DL, DB],
                    co: [UBL, DBL],
                    cp: [UBL, DBL]
                }
            ]
        },
        'f2l-1': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F2", "B2"
            ],
            finalStates: [
                {
                    ep: [UR, UF, UL, UB, FR, FL, BL],
                    co: [UFR, UFL, UBL],
                    cp: [UFR, UFL, UBL]
                },
                {
                    ep: [UF, UL, UB, UR, FL, BL, BR],
                    co: [UFL, UBL, UBR],
                    cp: [UFL, UBL, UBR]
                },
                {
                    ep: [UL, UB, UR, UF, BL, BR, FR],
                    co: [UBL, UBR, UFR],
                    cp: [UBL, UBR, UFR]
                },
                {
                    ep: [UB, UR, UF, UL, BR, FR, FL],
                    co: [UBR, UFR, UFL],
                    cp: [UBR, UFR, UFL]
                },
                {
                    ep: [DR, DF, DL, DB, FR, FL, BL],
                    co: [DFR, DFL, DBL],
                    cp: [DFR, DFL, DBL]
                },
                {
                    ep: [DF, DL, DB, DR, FL, BL, BR],
                    co: [DFL, DBL, DBR],
                    cp: [DFL, DBL, DBR]
                },
                {
                    ep: [DL, DB, DR, DF, BL, BR, FR],
                    co: [DBL, DBR, DFR],
                    cp: [DBL, DBR, DFR]
                },
                {
                    ep: [DB, DR, DF, DL, BR, FR, FL],
                    co: [DBR, DFR, DFL],
                    cp: [DBR, DFR, DFL]
                },
                {
                    ep: [DR, FR, UR, BR, DF, UF, UB],
                    co: [DFR, UFR, UBR],
                    cp: [DFR, UFR, UBR]
                },
                {
                    ep: [FR, UR, BR, DR, UF, UB, DB],
                    co: [UFR, UBR, DBR],
                    cp: [UFR, UBR, DBR]
                },
                {
                    ep: [UR, BR, DR, FR, UB, DB, DF],
                    co: [UBR, DBR, DFR],
                    cp: [UBR, DBR, DFR]
                },
                {
                    ep: [BR, DR, FR, UR, DB, DF, UF],
                    co: [DBR, DFR, UFR],
                    cp: [DBR, DFR, UFR]
                },
                {
                    ep: [DL, FL, UL, BL, DF, UF, UB],
                    co: [DFL, UFL, UBL],
                    cp: [DFL, UFL, UBL]
                },
                {
                    ep: [FL, UL, BL, DL, UF, UB, DB],
                    co: [UFL, UBL, DBL],
                    cp: [UFL, UBL, DBL]
                },
                {
                    ep: [UL, BL, DL, FL, UB, DB, DF],
                    co: [UBL, DBL, DFL],
                    cp: [UBL, DBL, DFL]
                },
                {
                    ep: [BL, DL, FL, UL, DB, DF, UF],
                    co: [DBL, DFL, UFL],
                    cp: [DBL, DFL, UFL]
                }
            ]
        },
        '5c': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F2", "B2"
            ],
            finalStates: [
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL],
                    cp: [UFR, UFL, UBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR],
                    cp: [UFR, UFL, UBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DFR],
                    cp: [UFR, UFL, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DFL],
                    cp: [UFR, UFL, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DBL],
                    cp: [UFR, UFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DBR],
                    cp: [UFR, UFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR],
                    cp: [UFR, UBL, UBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DFR],
                    cp: [UFR, UBL, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DFL],
                    cp: [UFR, UBL, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DBL],
                    cp: [UFR, UBL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DBR],
                    cp: [UFR, UBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DFR],
                    cp: [UFR, UBR, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DFL],
                    cp: [UFR, UBR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DBL],
                    cp: [UFR, UBR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DBR],
                    cp: [UFR, UBR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DFR, DFL],
                    cp: [UFR, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DFR, DBL],
                    cp: [UFR, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DFR, DBR],
                    cp: [UFR, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DFL, DBL],
                    cp: [UFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DFL, DBR],
                    cp: [UFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DBL, DBR],
                    cp: [UFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR],
                    cp: [UFL, UBL, UBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DFR],
                    cp: [UFL, UBL, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DFL],
                    cp: [UFL, UBL, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DBL],
                    cp: [UFL, UBL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DBR],
                    cp: [UFL, UBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DFR],
                    cp: [UFL, UBR, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DFL],
                    cp: [UFL, UBR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DBL],
                    cp: [UFL, UBR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DBR],
                    cp: [UFL, UBR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DFR, DFL],
                    cp: [UFL, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DFR, DBL],
                    cp: [UFL, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DFR, DBR],
                    cp: [UFL, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DFL, DBL],
                    cp: [UFL, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DFL, DBR],
                    cp: [UFL, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DBL, DBR],
                    cp: [UFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DFR],
                    cp: [UBL, UBR, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DFL],
                    cp: [UBL, UBR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DBL],
                    cp: [UBL, UBR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DBR],
                    cp: [UBL, UBR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DFR, DFL],
                    cp: [UBL, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DFR, DBL],
                    cp: [UBL, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DFR, DBR],
                    cp: [UBL, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DFL, DBL],
                    cp: [UBL, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DFL, DBR],
                    cp: [UBL, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DBL, DBR],
                    cp: [UBL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DFR, DFL],
                    cp: [UBR, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DFR, DBL],
                    cp: [UBR, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DFR, DBR],
                    cp: [UBR, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DFL, DBL],
                    cp: [UBR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DFL, DBR],
                    cp: [UBR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DBL, DBR],
                    cp: [UBR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [DFR, DFL, DBL],
                    cp: [DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [DFR, DFL, DBR],
                    cp: [DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [DFR, DBL, DBR],
                    cp: [DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [DFL, DBL, DBR],
                    cp: [DFL, DBL, DBR]
                }
            ]
        },
        '3c': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F2", "B2"
            ],
            finalStates: [
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, UBR, DFR],
                    cp: [UFR, UFL, UBL, UBR, DFR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, UBR, DFL],
                    cp: [UFR, UFL, UBL, UBR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, UBR, DBL],
                    cp: [UFR, UFL, UBL, UBR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, UBR, DBR],
                    cp: [UFR, UFL, UBL, UBR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, DFR, DFL],
                    cp: [UFR, UFL, UBL, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, DFR, DBL],
                    cp: [UFR, UFL, UBL, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, DFR, DBR],
                    cp: [UFR, UFL, UBL, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, DFL, DBL],
                    cp: [UFR, UFL, UBL, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, DFL, DBR],
                    cp: [UFR, UFL, UBL, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBL, DBL, DBR],
                    cp: [UFR, UFL, UBL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR, DFR, DFL],
                    cp: [UFR, UFL, UBR, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR, DFR, DBL],
                    cp: [UFR, UFL, UBR, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR, DFR, DBR],
                    cp: [UFR, UFL, UBR, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR, DFL, DBL],
                    cp: [UFR, UFL, UBR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR, DFL, DBR],
                    cp: [UFR, UFL, UBR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, UBR, DBL, DBR],
                    cp: [UFR, UFL, UBR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DFR, DFL, DBL],
                    cp: [UFR, UFL, DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DFR, DFL, DBR],
                    cp: [UFR, UFL, DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DFR, DBL, DBR],
                    cp: [UFR, UFL, DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UFL, DFL, DBL, DBR],
                    cp: [UFR, UFL, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR, DFR, DFL],
                    cp: [UFR, UBL, UBR, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR, DFR, DBL],
                    cp: [UFR, UBL, UBR, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR, DFR, DBR],
                    cp: [UFR, UBL, UBR, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR, DFL, DBL],
                    cp: [UFR, UBL, UBR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR, DFL, DBR],
                    cp: [UFR, UBL, UBR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, UBR, DBL, DBR],
                    cp: [UFR, UBL, UBR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DFR, DFL, DBL],
                    cp: [UFR, UBL, DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DFR, DFL, DBR],
                    cp: [UFR, UBL, DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DFR, DBL, DBR],
                    cp: [UFR, UBL, DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBL, DFL, DBL, DBR],
                    cp: [UFR, UBL, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DFR, DFL, DBL],
                    cp: [UFR, UBR, DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DFR, DFL, DBR],
                    cp: [UFR, UBR, DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DFR, DBL, DBR],
                    cp: [UFR, UBR, DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, UBR, DFL, DBL, DBR],
                    cp: [UFR, UBR, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFR, DFR, DFL, DBL, DBR],
                    cp: [UFR, DFR, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR, DFR, DFL],
                    cp: [UFL, UBL, UBR, DFR, DFL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR, DFR, DBL],
                    cp: [UFL, UBL, UBR, DFR, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR, DFR, DBR],
                    cp: [UFL, UBL, UBR, DFR, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR, DFL, DBL],
                    cp: [UFL, UBL, UBR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR, DFL, DBR],
                    cp: [UFL, UBL, UBR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, UBR, DBL, DBR],
                    cp: [UFL, UBL, UBR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DFR, DFL, DBL],
                    cp: [UFL, UBL, DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DFR, DFL, DBR],
                    cp: [UFL, UBL, DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DFR, DBL, DBR],
                    cp: [UFL, UBL, DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBL, DFL, DBL, DBR],
                    cp: [UFL, UBL, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DFR, DFL, DBL],
                    cp: [UFL, UBR, DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DFR, DFL, DBR],
                    cp: [UFL, UBR, DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DFR, DBL, DBR],
                    cp: [UFL, UBR, DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, UBR, DFL, DBL, DBR],
                    cp: [UFL, UBR, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UFL, DFR, DFL, DBL, DBR],
                    cp: [UFL, DFR, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DFR, DFL, DBL],
                    cp: [UBL, UBR, DFR, DFL, DBL]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DFR, DFL, DBR],
                    cp: [UBL, UBR, DFR, DFL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DFR, DBL, DBR],
                    cp: [UBL, UBR, DFR, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, UBR, DFL, DBL, DBR],
                    cp: [UBL, UBR, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBL, DFR, DFL, DBL, DBR],
                    cp: [UBL, DFR, DFL, DBL, DBR]
                },
                {
                    ep: [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR],
                    co: [UBR, DFR, DFL, DBL, DBR],
                    cp: [UBR, DFR, DFL, DBL, DBR]
                }
            ]
        },
        'l2e': {
            movesToUse: [
                "U", "U'", "U2", "D", "D'", "D2",
                "L", "L'", "L2", "R", "R'", "R2",
                "F2", "B2"
            ],
            finalStates: [
                {
                    ep: [UR, UF, UL, UB, FR, FL, BL, BR, DR, DF, DL, DB],
                    eo: [UR, UF, UL, UB, FR, FL, BL, BR, DR, DF, DL, DB]
                }
            ]
        }
    }

    /////// RETURN OBJECT ///////
    return {
        /////// PROPERTIES ///////
        steps: steps,

        /////// METHODS ///////
        move: move,
        identity: identity,
        asString: asString,
        toJSON: toJSON,
        solve: solve,
        solveStep: solveStep,
    }

    /////// PUBLIC METHODS ///////
    function move(algorithm) {
        return publicCube.move(algorithm)
    }

    function identity() {
        return publicCube.identity()
    }

    function asString() {
        return publicCube.asString()
    }

    function toJSON() {
        return publicCube.toJSON()
    }

    function solve(...stepsToSolve) {
        let skeletons = []

        solveStepsRecursively([], ...stepsToSolve)

        skeletons.sort((skeletonA, skeletonB) => {
            return getLength(skeletonA) - getLength(skeletonB)
        })

        return skeletons

        /////// HELPER FUNCTIONS ///////
        function solveStepsRecursively(algsSoFar, ...stepsToSolve) {
            let stepToSolve = stepsToSolve.shift()
            let algs = solveStep(steps[stepToSolve])
            if (algs.length > 10) algs.length = 10

            for (let alg of algs) {
                let currentAlgsSoFar = algsSoFar.slice()
                currentAlgsSoFar.push(alg)

                if (stepsToSolve.length) {
                    publicCube.move(alg)
                    solveStepsRecursively(currentAlgsSoFar, ...stepsToSolve)
                    publicCube.move(Cube.inverse(alg))
                } else {
                    skeletons.push(currentAlgsSoFar)
                }
            }
        }

        function getLength(skeleton) {
            return skeleton.reduce((length, step) => length + (step ? step.split(' ').length : 0), 0)
        }
    }

    function solveStep(step) {
        let solutions = new Set()
        let cube = new Cube(publicCube)

        // Generate solutions
        for (let finalState of step.finalStates) {
            if (!graphs.has(finalState)) {
                graphs.set(finalState, generateGraph(finalState, step.movesToUse))
            }
            let graph = graphs.get(finalState)

            let key = transformCubeState(cube, finalState)
            if (graph.has(key)) {
                graph.get(key).paths
                    .forEach(solutions.add, solutions)
            }

            solutions = solveStepRecursively(solutions, graph, cube, finalState, step.movesToUse)
        }

        // Sort solutions by length
        solutions = new Set(Array.from(solutions)
            .sort((solutionA, solutionB) => solutionA.split(' ').length - solutionB.split(' ').length))

        return solutions
    }

    /////// PRIVATE METHODS ///////
    function solveStepRecursively(solutions, graph, cube, finalState, movesToUse, movesSoFar = []) {
        let currentMovesToUse = movesToUse.slice()
        let lastMove, secondToLastMove
        if (movesSoFar.length > 0) lastMove = movesSoFar[movesSoFar.length - 1]
        if (movesSoFar.length > 1) secondToLastMove = movesSoFar[movesSoFar.length - 2]
        if (lastMove) {
            currentMovesToUse = currentMovesToUse.filter((move) => {
                if (secondToLastMove && secondToLastMove[0] === move[0]  && secondToLastMove[0] === oppositeMoves[lastMove[0]]) return false
                return lastMove[0] !== move[0]
            })
        }

        for (let move of currentMovesToUse) {
            cube.move(move)
            movesSoFar.push(move)

            let key = transformCubeState(cube, finalState)
            if (graph.has(key)) {
                graph.get(key).paths
                    .forEach((path) => {
                        // Check if the new solution has cancellations
                        path = path.split(' ')
                        if (move[0] === path[0][0]) return
                        if (lastMove && lastMove[0] === path[0][0] && lastMove[0] === oppositeMoves[move[0]]) return
                        if (path[1] && move[0] === path[1][0] && move[0] === oppositeMoves[path[0][0]]) return

                        let solution = movesSoFar.concat(path).join(' ').trim()
                        solutions.add(solution)
                    })
            }

            if (movesSoFar.length < maxForwardDepth) {
                solutions = solveStepRecursively(solutions, graph, cube, finalState, movesToUse, movesSoFar)
            }

            cube.move(Cube.inverse(move))
            movesSoFar.pop()
        }

        return solutions
    }

    function generateGraph(finalState, movesToUse) {
        let graph = new Map()
        let cube = new Cube()

        graph.set(transformCubeState(cube, finalState), {
            solved: true,
            paths: new Set(['']) // empty string is important
        })

        graph = generateGraphRecursively(graph, cube, finalState, movesToUse)

        graph.forEach((node) => {
            // Sort paths shortest to longest
            node.paths = new Set(Array.from(node.paths)
                .sort((pathA, pathB) => pathA.split(' ').length - pathB.split(' ').length))
        })

        return graph
    }

    function generateGraphRecursively(graph, cube, finalState, movesToUse, movesSoFar = []) {
        let currentMovesToUse = movesToUse.slice()
        let lastMove, secondToLastMove
        if (movesSoFar.length > 0) lastMove = movesSoFar[movesSoFar.length - 1]
        if (movesSoFar.length > 1) secondToLastMove = movesSoFar[movesSoFar.length - 2]
        if (lastMove) {
            currentMovesToUse = currentMovesToUse.filter((move) => {
                if (secondToLastMove && move[0] === secondToLastMove[0] && secondToLastMove[0] === oppositeMoves[lastMove[0]]) return false
                return move[0] !== lastMove[0]
            })
        }

        for (let move of currentMovesToUse) {
            cube.move(move)
            movesSoFar.push(move)

            let key = transformCubeState(cube, finalState)
            let path = Cube.inverse(movesSoFar.join(' '))

            let node = graph.get(key)

            if (!node) {
                node = {
                    paths: new Set(),
                    solved: false
                }
                graph.set(key, node)
            }

            if (!node.solved) {
                node.paths.add(path)

                if (movesSoFar.length < maxReverseDepth) {
                    graph = generateGraphRecursively(graph, cube, finalState, movesToUse, movesSoFar)
                }
            }

            cube.move(Cube.inverse(move))
            movesSoFar.pop()
        }

        return graph
    }

    function transformCubeState(cube, finalState) {
        let cubeState = cube.toJSON()
        let newCubeState = {}
        newCubeState.eo = cubeState.eo.map((orientation, position) => {
            if (!finalState.eo?.includes(cubeState.ep[position])) return "-";
            return orientation;
        });
        newCubeState.ep = cubeState.ep.map((edge, position) => {
            if (!finalState.ep?.includes(edge)) return "-";
            return edge.toString(16);
        });
        newCubeState.co = cubeState.co.map((orientation, position) => {
            if (!finalState.co?.includes(cubeState.cp[position])) return "-";
            return orientation;
        });
        newCubeState.cp = cubeState.cp.map((corner, position) => {
            if (!finalState.cp?.includes(corner)) return "-";
            return corner;
        });

        return [
            newCubeState.eo.join(''),
            newCubeState.ep.join(''),
            newCubeState.co.join(''),
            newCubeState.cp.join('')
        ].join('')
    }
}

// function getScramble(
// cornerSetsToPermute = [],
// edgeSetsToPermute = [],
// cornerSetsToDisorient = [],
// edgeSetsToDisorient = [],
// ) {
// const cube = new Cube();
// let cubeState = cube.toJSON();

// cubeState = permute(cubeState, "cp", cornerSetsToPermute);
// cubeState = permute(cubeState, "ep", edgeSetsToPermute);
// cubeState = disorient(cubeState, "co", cornerSetsToDisorient);
// cubeState = disorient(cubeState, "eo", edgeSetsToDisorient);

// return new Cube(cubeState);
// }

// function permute(cubeState, cubeStatePropertyToPermute, setsToPermute) {
// setsToPermute.forEach((set) => {
// permutedSet = shuffle(set.slice());
// set.forEach((value, index) => {
// cubeState[cubeStatePropertyToPermute][value] = permutedSet[index];
// });
// });

// return cubeState;
// }

// function disorient(cubeState, cubeStatePropertyToDisorient, setsToDisorient) {
// let maxOrientation = cubeStatePropertyToDisorient === "co" ? 3 : 2;
// setsToDisorient.forEach((set) => {
// disorientedSet = set.map((value) =>
// Math.floor(Math.random() * maxOrientation),
// );
// set.forEach((value, index) => {
// cubeState[cubeStatePropertyToDisorient][value] = disorientedSet[index];
// });
// });

// return cubeState;
// }

// function shuffle(array) {
// var m = array.length,
// t,
// i;

// // While there remain elements to shuffle…
// while (m) {
// // Pick a remaining element…
// i = Math.floor(Math.random() * m--);

// // And swap it with the current element.
// t = array[m];
// array[m] = array[i];
// array[i] = t;
// }

// return array;
// }