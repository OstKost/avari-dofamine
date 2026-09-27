package domain_test

import (
	"testing"

	"github.com/google/uuid"
	"github.com/ostkost/avari-dofamine/api/internal/modules/payment/domain"
)

func TestPayment_Invariants(t *testing.T) {
	orderID := uuid.New()
	p, err := domain.NewPayment(uuid.New(), orderID, "mock", "mock-pay-123", "250.00", "http://confirm")
	if err != nil {
		t.Fatalf("unexpected error creating payment: %v", err)
	}

	if p.AmountRUB() != "250.00" {
		t.Errorf("expected amount 250.00, got %s", p.AmountRUB())
	}

	if p.Status() != domain.StatusPending {
		t.Errorf("expected initial status pending, got %s", p.Status())
	}

	// Test MarkSucceeded
	if err := p.MarkSucceeded(); err != nil {
		t.Fatalf("unexpected error marking succeeded: %v", err)
	}
	if p.Status() != domain.StatusSucceeded {
		t.Errorf("expected status succeeded, got %s", p.Status())
	}

	// Test transition from terminal status
	if err := p.MarkFailed("some reason"); err != domain.ErrInvalidStatusTransition {
		t.Errorf("expected ErrInvalidStatusTransition from succeeded to failed, got %v", err)
	}
}
