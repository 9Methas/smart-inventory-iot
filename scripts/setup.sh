#!/bin/bash
# Setup script for Smart Inventory project

echo "🚀 Setting up Smart Inventory & Environment Monitor..."

# Install root dependencies
npm install

# Install workspace dependencies
npm install --workspace=frontend
npm install --workspace=backend
npm install --workspace=shared
npm install --workspace=iot

echo "✅ Setup complete!"

