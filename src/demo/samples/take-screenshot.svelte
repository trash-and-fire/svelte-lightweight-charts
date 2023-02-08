<h1>Take screenshot</h1>
<script>
  import { Chart, LineSeries } from 'svelte-lightweight-charts';
  import Button from './components/button.svelte';

  let chart;
  let data = [
    { time: '2019-04-11', value: 75 },
    { time: '2019-04-12', value: 85 },
    { time: '2019-04-13', value: 90 },
    { time: '2019-04-14', value: 80 },
    { time: '2019-04-15', value: 70 },
  ];

  function downloadScreenshot() {
    const canvas = chart.takeScreenshot();
    const link = document.createElement('a');
    link.download = 'chart-screenshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
</script>

<Chart width={600} height={300} ref={ref => chart = ref}>
    <LineSeries data={data} />
</Chart>
<Button on:click={downloadScreenshot} value="Download screenshot"/>
