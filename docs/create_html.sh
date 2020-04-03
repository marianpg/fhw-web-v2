#!/bin/sh

echo ""
echo ""
echo "Creating HTML for language [en_GB]"
sphinx-build -b html -D language=en_GB source build/html/en_GB

echo ""
echo ""
echo "Creating HTML for language [de_DE]"
sphinx-build -b html -D language=de_DE source build/html/de_DE