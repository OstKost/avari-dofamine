package main

import (
	"context"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/ostkost/dopamine-market/api/internal/modules/catalog/domain"
)

type memoryCatalogRepo struct {
	categories map[uuid.UUID]*domain.Category
	products   map[uuid.UUID]*domain.Product
}

func newMemoryCatalogRepo() *memoryCatalogRepo {
	return &memoryCatalogRepo{
		categories: make(map[uuid.UUID]*domain.Category),
		products:   make(map[uuid.UUID]*domain.Product),
	}
}

func (m *memoryCatalogRepo) ListCategories(ctx context.Context) ([]*domain.Category, error) {
	var list []*domain.Category
	for _, c := range m.categories {
		list = append(list, c)
	}
	return list, nil
}

func (m *memoryCatalogRepo) GetCategoryByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) {
	c, ok := m.categories[id]
	if !ok {
		return nil, domain.ErrCategoryNotFound
	}
	return c, nil
}

func (m *memoryCatalogRepo) ListProducts(ctx context.Context, categoryID *uuid.UUID, limit, offset int) ([]*domain.Product, int, error) {
	var list []*domain.Product
	for _, p := range m.products {
		if categoryID == nil || p.CategoryID() == *categoryID {
			list = append(list, p)
		}
	}
	return list, len(list), nil
}

func (m *memoryCatalogRepo) SearchProducts(ctx context.Context, query string, limit, offset int) ([]*domain.Product, int, error) {
	var list []*domain.Product
	for _, p := range m.products {
		list = append(list, p)
	}
	return list, len(list), nil
}

func (m *memoryCatalogRepo) GetProductByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	p, ok := m.products[id]
	if !ok {
		return nil, domain.ErrProductNotFound
	}
	return p, nil
}

func (m *memoryCatalogRepo) GetProductsByIDs(ctx context.Context, ids []uuid.UUID) (map[uuid.UUID]*domain.Product, error) {
	res := make(map[uuid.UUID]*domain.Product)
	for _, id := range ids {
		if p, ok := m.products[id]; ok {
			res[id] = p
		}
	}
	return res, nil
}

func (m *memoryCatalogRepo) InsertCategory(ctx context.Context, cat *domain.Category) error {
	m.categories[cat.ID()] = cat
	return nil
}

func (m *memoryCatalogRepo) InsertProduct(ctx context.Context, prod *domain.Product) error {
	m.products[prod.ID()] = prod
	return nil
}

func TestSeedCatalog_CompletenessAndInvariants(t *testing.T) {
	repo := newMemoryCatalogRepo()
	ctx := context.Background()

	err := seedCatalog(ctx, repo)
	if err != nil {
		t.Fatalf("seedCatalog returned unexpected error: %v", err)
	}

	// 1. Verify Category count (at least 18 subcategories across 6 super-categories)
	if len(repo.categories) < 18 {
		t.Errorf("expected >= 18 subcategories, got %d", len(repo.categories))
	}
	if len(repo.categories) != 24 {
		t.Logf("Total categories seeded: %d", len(repo.categories))
	}

	// 2. Verify Product count (at least 180 products)
	if len(repo.products) < 180 {
		t.Errorf("expected >= 180 synthetic products, got %d", len(repo.products))
	}
	if len(repo.products) != 200 {
		t.Logf("Total products seeded: %d", len(repo.products))
	}

	// 3. Verify Deterministic UUIDs and field completeness
	seenCategorySlugs := make(map[string]bool)
	for catID, cat := range repo.categories {
		if catID == uuid.Nil {
			t.Errorf("category has nil UUID: %s", cat.Name())
		}
		if cat.Name() == "" || cat.Slug() == "" || cat.Description() == "" {
			t.Errorf("category has empty fields: %+v", cat)
		}
		if seenCategorySlugs[cat.Slug()] {
			t.Errorf("duplicate category slug: %s", cat.Slug())
		}
		seenCategorySlugs[cat.Slug()] = true
	}

	for prodID, prod := range repo.products {
		if prodID == uuid.Nil {
			t.Errorf("product has nil UUID: %s", prod.Name())
		}
		if prod.CategoryID() == uuid.Nil {
			t.Errorf("product has nil category ID: %s", prod.Name())
		}
		if prod.Name() == "" || prod.Description() == "" || prod.ImageSeed() == "" {
			t.Errorf("product has empty fields: %+v", prod)
		}

		priceVal, _ := prod.PriceRUB().Float64()
		if priceVal < 100 || priceVal > 250000 {
			t.Errorf("product %q price %.2f is out of realistic range [100, 250000]", prod.Name(), priceVal)
		}

		// Check category specific realistic price constraints
		if strings.Contains(prod.CategoryName(), "🎪") {
			if priceVal < 100 || priceVal > 1500 {
				t.Errorf("dopamine shop product %q price %.2f outside 100 - 1500 range", prod.Name(), priceVal)
			}
		}
		if strings.Contains(prod.CategoryName(), "👑") {
			if priceVal < 45000 || priceVal > 250000 {
				t.Errorf("luxury brand product %q price %.2f outside 45000 - 250000 range", prod.Name(), priceVal)
			}
		}
	}
}
