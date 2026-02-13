# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A standalone 2.5D isometric visualization of a residential community using Pixi.js v7.3.2. No build system required - runs directly in browser via CDN.

## Running the Project

Open `index.html` directly in a browser. No build or server required.

## Architecture

**Entry**: `index.html` initializes `PIXI.Application` and creates a `worldContainer` scene.

**Core Systems**:

- `toIsometric(x, y, z)` - Converts 3D coordinates to 2D isometric projection
- `Building` class - Renders 3-faced isometric buildings (top, left, right faces) with windows
- `BUILDING_TYPES` - 5 building configurations (Residential Low/High, Office, Commercial, Facility)
- `generateBuildings()` - Creates ~30 buildings in grid pattern with depth sorting by Y-coordinate

**Interaction**: Mouse drag to pan, wheel to zoom (0.3x-2x), click to select buildings.

## Key Files

- `index.html` - All application code (HTML + JavaScript)
