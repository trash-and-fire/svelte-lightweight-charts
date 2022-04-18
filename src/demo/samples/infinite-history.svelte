<h1>Infinite History</h1>
<div class="container">
    <Chart width={600} height={300}>
        <TimeScale
            ref={handleTimeScaleRef}
            on:visibleLogicalRangeChange={handleVisibleLogicalRangeChange}
        />
        <CandlestickSeries
            ref={handleSeriesRef}
            data={data}
        />
    </Chart>
</div>

<script>
    import Chart from 'svelte-lightweight-charts/components/chart.svelte';
    import CandlestickSeries from 'svelte-lightweight-charts/components/candlestick-series.svelte';
    import TimeScale from 'svelte-lightweight-charts/components/time-scale.svelte';

    let timeScale;
    let candleSeries;

    const period = {
        timeFrom: { day: 1, month: 1, year: 2018 },
        timeTo: { day: 1, month: 1, year: 2019 },
    };
    let data = generateBarsData(period);

    let timer = null;

    function handleVisibleLogicalRangeChange({ detail: logicalRange }) {
        if (timer !== null) {
            return;
        }
        timer = setTimeout(() => {
         if (logicalRange !== null) {
             const barsInfo = candleSeries.barsInLogicalRange(logicalRange);
             if (barsInfo !== null && barsInfo.barsBefore < 10) {
                 const firstTime = getBusinessDayBeforeCurrentAt(data[0].time, 1);
                 const lastTime = getBusinessDayBeforeCurrentAt(firstTime, Math.max(100, -barsInfo.barsBefore + 100));
                 const newPeriod = {
                     timeFrom: lastTime,
                     timeTo: firstTime,
                 };
                 data = [...generateBarsData(newPeriod), ...data];
                 candleSeries.setData(data);
             }
         }
         timer = null;
        }, 500);
    }

    function handleTimeScaleRef(api) {
        timeScale = api;
    }
    function handleSeriesRef(api) {
        candleSeries = api;
    }

    function getBusinessDayBeforeCurrentAt(date, daysDelta) {
        const dateWithDelta = new Date(Date.UTC(date.year, date.month - 1, date.day - daysDelta, 0, 0, 0, 0));
        return { year: dateWithDelta.getFullYear(), month: dateWithDelta.getMonth() + 1, day: dateWithDelta.getDate() };
    }

    function generateBarsData(period) {
        const res = [];
        const controlPoints = generateControlPoints(res, period);
        for (let i = 0; i < controlPoints.length - 1; i++) {
            const left = controlPoints[i];
            const right = controlPoints[i + 1];
            fillBarsSegment(left, right, res);
        }
        return res;
    }

    function fillBarsSegment(left, right, points) {
        const deltaY = right.price - left.price;
        const deltaX = right.index - left.index;
        const angle = deltaY / deltaX;
        for (let i = left.index; i <= right.index; i++) {
            const basePrice = left.price + (i - left.index) * angle;
            const openNoise = (0.1 - Math.random() * 0.2) + 1;
            const closeNoise = (0.1 - Math.random() * 0.2) + 1;
            const open = basePrice * openNoise;
            const close = basePrice * closeNoise;
            const high = Math.max(basePrice * (1 + Math.random() * 0.2), open, close);
            const low = Math.min(basePrice * (1 - Math.random() * 0.2), open, close);
            points[i].open = open;
            points[i].high = high;
            points[i].low = low;
            points[i].close = close;
        }
    }

    function generateControlPoints(res, period, dataMultiplier) {
        let time = period !== undefined ? period.timeFrom : { day: 1, month: 1, year: 2018 };
        const timeTo = period !== undefined ? period.timeTo : { day: 1, month: 1, year: 2019 };
        const days = getDiffDays(time, timeTo);
        dataMultiplier = dataMultiplier || 1;
        const controlPoints = [];
        controlPoints.push({ index: 0, price: getRandomPrice() * dataMultiplier });
        for (let i = 0; i < days; i++) {
            if (i > 0 && i < days - 1 && Math.random() < 0.05) {
                controlPoints.push({ index: i, price: getRandomPrice() * dataMultiplier });
            }
            res.push({ time: time });
            time = nextBusinessDay(time);
        }
        controlPoints.push({ index: res.length - 1, price: getRandomPrice() * dataMultiplier });
        return controlPoints;
    }

    function getDiffDays(dateFrom, dateTo) {
        const df = convertBusinessDayToUTCTimestamp(dateFrom);
        const dt = convertBusinessDayToUTCTimestamp(dateTo);
        const diffTime = Math.abs(dt.getTime() - df.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function convertBusinessDayToUTCTimestamp(date) {
        return new Date(Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0, 0));
    }

    function nextBusinessDay(time) {
        const d = convertBusinessDayToUTCTimestamp({ year: time.year, month: time.month, day: time.day + 1 });
        return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
    }

    function getRandomPrice() {
        return 10 + Math.round(Math.random() * 10000) / 100;
    }
</script>
