#!/bin/bash

echo "🗺️ Storm Maps Setup Script"
echo "=========================="
echo ""

# Create the storm-maps directory
echo "📁 Creating storm-maps directory..."
mkdir -p public/images/storm-maps

echo ""
echo "✅ Directory created: public/images/storm-maps/"
echo ""

echo "📸 Next Steps:"
echo "1. Save your Storm Maps images to:"
echo "   - public/images/storm-maps/storm-map-1.jpg (Rain intensity)"
echo "   - public/images/storm-maps/storm-map-2.jpg (Hail detection)"
echo "   - public/images/storm-maps/storm-map-3.jpg (Wind gusts)"
echo "   - public/images/storm-maps/storm-map-4.jpg (Overall coverage)"
echo ""
echo "2. Restart the server:"
echo "   pkill -f 'node server.js' && node server.js &"
echo ""
echo "3. Test at: http://localhost:8080"
echo ""

# Check if images exist
echo "🔍 Checking for existing images..."
if [ -f "public/images/storm-maps/storm-map-1.jpg" ]; then
    echo "✅ storm-map-1.jpg found"
else
    echo "❌ storm-map-1.jpg missing"
fi

if [ -f "public/images/storm-maps/storm-map-2.jpg" ]; then
    echo "✅ storm-map-2.jpg found"
else
    echo "❌ storm-map-2.jpg missing"
fi

if [ -f "public/images/storm-maps/storm-map-3.jpg" ]; then
    echo "✅ storm-map-3.jpg found"
else
    echo "❌ storm-map-3.jpg missing"
fi

if [ -f "public/images/storm-maps/storm-map-4.jpg" ]; then
    echo "✅ storm-map-4.jpg found"
else
    echo "❌ storm-map-4.jpg missing"
fi

echo ""
echo "🎯 Once all images are saved, your Storm Maps will appear in the website!" 