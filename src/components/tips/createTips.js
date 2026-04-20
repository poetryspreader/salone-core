import { Shift, Worker } from "../../../app.js";

export async function createTips(req, res) {
    try {
        let {
            periods = [],
            totalTips,
            transportFund,
            selectedWorkers = [],
            slots = []
        } = req.body;


        console.log("BODY body:", req.body)

        function mergePeriodsWithTips(periods, slots, totalTips) {
            const cleanPeriods = periods.filter(p => p.till !== '' && p.amount !== '');
            let total = 0;

            const stats = cleanPeriods.map((period, index) => {
                const current = Number(period.amount || 0);
                let realAmount;

                if (index > 0) {
                    const prev = Number(cleanPeriods[index - 1].amount || 0);
                    realAmount = current - prev;
                } else {
                    realAmount = current;
                }

                total += realAmount;

                return Math.floor(realAmount * 100) / 100;
            });

            const lastAmount = Number(totalTips) - total;

            const statsWithLast = [
                ...stats,
                Math.floor(lastAmount * 100) / 100
            ];

            const slotsWithTips = slots.map((slot, index) => ({
                ...slot,
                cleanTipsPerPeriod: statsWithLast[index] ?? 0
            }));

            return slotsWithTips
        }

        const mergedPeriodsWithTips = mergePeriodsWithTips(periods, slots, totalTips);

        console.log('clean tips per period 1:', mergedPeriodsWithTips)

        const totalKitchenTips = Number(Math.floor(Number(totalTips) * 10) / 100);

        console.log(typeof(transportFund))
        // const transportFund =
        //     Number(totalTips) < 500 ? 0 :
        //         Number(totalTips) < 1000 ? 25 :
        //             50;

        const transportPerPeriod = periods.length
            ? transportFund / periods.length
            : 0;

        // общая инфа по периодам
        const updatedSlots = mergedPeriodsWithTips.map((slot) => {
            const kitchenPerPeriod = (slot.cleanTipsPerPeriod / Number(totalTips)) * totalKitchenTips;
            const cleanAmountPerPeriod = slot.cleanTipsPerPeriod - kitchenPerPeriod - transportPerPeriod;
            console.log(kitchenPerPeriod, cleanAmountPerPeriod)

            const workers = slot.workers || [];

            // 2. считаем общий коэффициент
            const totalCoeff = workers.reduce((sum, w) => {
                return sum + Number(w.baseCoefficient || 0);
            }, 0);

            // 3. считаем деньги за 1 коэффициент
            const valuePerCoeff = totalCoeff > 0
                ? cleanAmountPerPeriod / totalCoeff
                : 0;

            // 4. распределяем по работникам
            const workersWithPay = workers.map((w) => ({
                ...w,
                payout: Math.floor(valuePerCoeff * Number(w.baseCoefficient || 0) * 100) / 100
            }));

            return {
                ...slot,
                transportPerPeriod: Math.floor(transportPerPeriod * 100) / 100,
                kitchenPerPeriod: Math.floor(kitchenPerPeriod * 100) / 100,
                cleanAmountPerPeriod: Math.floor(cleanAmountPerPeriod * 100) / 100,
                workersWithPay
            };
        })

        // console.log(JSON.stringify(updatedSlots, null, 2));

        // 🔥 НОВОЕ: считаем totalPerWorker
        const totals = {};

        updatedSlots.forEach(slot => {
            slot.workersWithPay.forEach(w => {
                if (!totals[w.worker]) {
                    totals[w.worker] = 0;
                }

                totals[w.worker] += w.payout;
            });
        });

        const totalPerWorker = Object.entries(totals).map(([worker, totalPayout]) => ({
            worker,
            totalPayout: Math.floor(totalPayout * 100) / 100
        }));

        console.log(JSON.stringify(totalPerWorker, null, 2));

        res.status(201).json({
            data: updatedSlots,
            totalPerWorker,
            meta: {
                totalKitchenTips,
                transportFund
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create shift"
        });
    }
}