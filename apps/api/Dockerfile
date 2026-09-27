# Stage 1: Build binaries
FROM golang:1.23.4-alpine AS builder

WORKDIR /build

RUN apk add --no-cache git ca-certificates tzdata

COPY go.mod go.sum ./
RUN export GOTOOLCHAIN=local && go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /build/bin/server ./cmd/server && \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /build/bin/worker ./cmd/worker && \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /build/bin/migrator ./cmd/migrator && \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o /build/bin/seed ./cmd/seed

# Stage 2: Minimal runtime image
FROM alpine:3.20

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata curl && \
    addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

COPY --from=builder /build/bin/server /app/server
COPY --from=builder /build/bin/worker /app/worker
COPY --from=builder /build/bin/migrator /app/migrator
COPY --from=builder /build/bin/seed /app/seed

USER appuser

EXPOSE 8080

CMD ["/app/server"]
