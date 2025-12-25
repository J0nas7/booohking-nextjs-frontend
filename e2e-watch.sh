#!/usr/bin/env bash

PID_FILE=".e2e-watch.pid"

run_tests() {
  if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if kill -0 "$OLD_PID" 2>/dev/null; then
      echo "Stopping previous test run (PID $OLD_PID)..."
      kill -- -"$OLD_PID"
      wait "$OLD_PID" 2>/dev/null
    fi
  fi

  echo "Starting new test run..."

  (
    npm run test && npx cypress run
  ) &

  echo $! > "$PID_FILE"
}

# If script is called with "run", execute tests
if [ "$1" = "run" ]; then
  run_tests
  exit 0
fi

# Otherwise start watcher
chokidar \
  "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}" \
  "src/**/*.{js,ts,jsx,tsx}" \
  -c "./e2e-watch.sh run"
