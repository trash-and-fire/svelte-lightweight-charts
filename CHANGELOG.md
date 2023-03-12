# Svelte Lightweight Charts changelog

## 2.1.0

- Added `markers` property to `<[Type]Series>` components.
- Supported `autoSize` option on `<Chart>` component.
- Reduced layout shift on SSR. The chart component will reserve the specified width and height if the chart is not auto-sized.

## 2.0.0

This major release raises the required `lightweight-charts` package version to 4.0.0 providing support for new features from the package.

Check out `lightweight-charts@4.0.0` [release notes](https://github.com/tradingview/lightweight-charts/releases/tag/v4.0.0) first.

### Major updates

- Compatibility with SvelteKit. The package comes as ESM compatible, which provides full support for modern tools and bundlers.

### Breaking changes

- ESM only (CJS support can be added on demand in the future).
- Removed deprecated chart action exports: `chart`, `ChartActionParams` and default export.
- `<[Type]Series>`: removed `scaleMargins` property instead use the same property on `<PriceScale>` component.
- `<PriceLine>`: `price` is required property now.
- `<PriceScale>`: `drawTicks` property is renamed to `ticksVisible`.

### New features

- `<AreaSeries>`: added `invertFilledArea` property which when set to true will invert the filled area (draw above the line instead of below it).
- `<PriceScale>`: added `textColor` property.
