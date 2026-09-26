package domain

import (
	"time"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type Product struct {
	id           uuid.UUID
	categoryID   uuid.UUID
	categoryName string
	name         string
	description  string
	priceRUB     decimal.Decimal
	imageSeed    string
	createdAt    time.Time
}

func NewProduct(
	id uuid.UUID,
	categoryID uuid.UUID,
	categoryName string,
	name string,
	description string,
	priceRUB decimal.Decimal,
	imageSeed string,
	createdAt time.Time,
) *Product {
	if id == uuid.Nil {
		id = uuid.New()
	}
	if createdAt.IsZero() {
		createdAt = time.Now().UTC()
	}
	return &Product{
		id:           id,
		categoryID:   categoryID,
		categoryName: categoryName,
		name:         name,
		description:  description,
		priceRUB:     priceRUB,
		imageSeed:    imageSeed,
		createdAt:    createdAt,
	}
}

func (p *Product) ID() uuid.UUID {
	return p.id
}

func (p *Product) CategoryID() uuid.UUID {
	return p.categoryID
}

func (p *Product) CategoryName() string {
	return p.categoryName
}

func (p *Product) Name() string {
	return p.name
}

func (p *Product) Description() string {
	return p.description
}

func (p *Product) PriceRUB() decimal.Decimal {
	return p.priceRUB
}

func (p *Product) ImageSeed() string {
	return p.imageSeed
}

func (p *Product) CreatedAt() time.Time {
	return p.createdAt
}
