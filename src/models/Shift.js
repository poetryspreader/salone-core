import mongoose from "mongoose";

// SHIFT MODEL
const shiftSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    isWeekend: {
        type: Boolean,
        default: false
    },
    periods: [
        {
            _id: false,
            from: {
                type: Number
            },
            till: {
                type: Number,
            },
            tipsAmount: {
                type: Number,
                required: true
            },
            cleanTips: {
                type: Number,
                required: true
            },
            halfWaiterCoef: {
                type: Number
            },
            somelierCoef: {
                type: Number
            },
            halfBartenderCoef: {
                type: Number
            },
            earlyWorkerLateShiftImpact: {
                type: Number
            },
            workerManualRates: [
                {
                    workerId: {
                        type: String
                    },
                    value: {
                        type: Number
                    }
                }
            ]
        }
    ],
    schedule: [
        {
            _id: false,
            worker: { type: mongoose.Schema.Types.ObjectId, ref: "Worker" },
            shiftStart: {
                type: Number,
                required: true
            },
            shiftEnd: {
                type: Number
            },
            tillEnd: { type: Boolean, default: true},
            coefficient: { type: Number }
        }
    ],
    tipsTotal: {
        type: Number
    },
    tipsKitchen: {
        type: Number,
        default: 0
    },
    transportFund: {
        type: Number,
        default: 0
    },
    distribution: [
        {
            _id: false,
            worker: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Worker"
            },
            amount: {
                type: Number,
                default: 0
            }
        }
    ]
});
export const Shift = mongoose.model("Shift", shiftSchema);