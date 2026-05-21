import Database from "better-sqlite3";
import path from "path";
import { seedProducts } from "./seed-data";

const DB_PATH = path.join(process.cwd(), "data", "museum-grades.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");

  initSchema(_db);
  seedIfEmpty(_db);

  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id           TEXT PRIMARY KEY,
      slug         TEXT UNIQUE NOT NULL,
      brand        TEXT NOT NULL,
      name         TEXT NOT NULL,
      price        REAL NOT NULL,
      est_retail   REAL NOT NULL DEFAULT 0,
      savings_pct  INTEGER NOT NULL DEFAULT 0,
      condition    TEXT NOT NULL,
      color        TEXT NOT NULL DEFAULT '',
      material     TEXT NOT NULL DEFAULT '',
      bag_type     TEXT NOT NULL DEFAULT '',
      images       TEXT NOT NULL DEFAULT '[]',
      description  TEXT NOT NULL DEFAULT '',
      item_number  TEXT NOT NULL DEFAULT '',
      exterior     TEXT NOT NULL DEFAULT '',
      hardware     TEXT NOT NULL DEFAULT '',
      interior     TEXT NOT NULL DEFAULT '',
      comes_with   TEXT NOT NULL DEFAULT '',
      size_base    TEXT NOT NULL DEFAULT '',
      size_height  TEXT NOT NULL DEFAULT '',
      size_depth   TEXT NOT NULL DEFAULT '',
      size_drop    TEXT NOT NULL DEFAULT '',
      created_at   INTEGER NOT NULL DEFAULT (unixepoch())
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO products (
      id, slug, brand, name, price, est_retail, savings_pct,
      condition, color, material, bag_type, images,
      description, item_number, exterior, hardware, interior, comes_with,
      size_base, size_height, size_depth, size_drop
    ) VALUES (
      @id, @slug, @brand, @name, @price, @estRetail, @savingsPercent,
      @condition, @color, @material, @bagType, @images,
      @description, @itemNumber, @exterior, @hardware, @interior, @comesWith,
      @sizeBase, @sizeHeight, @sizeDepth, @sizeDrop
    )
  `);

  const insertMany = db.transaction(() => {
    for (const p of seedProducts) {
      insert.run({
        id: p.id,
        slug: p.slug,
        brand: p.brand,
        name: p.name,
        price: p.price,
        estRetail: p.estRetail,
        savingsPercent: p.savingsPercent,
        condition: p.condition,
        color: p.color,
        material: p.material,
        bagType: p.bagType,
        images: JSON.stringify(p.images),
        description: p.description,
        itemNumber: p.itemNumber,
        exterior: p.exterior,
        hardware: p.hardware,
        interior: p.interior,
        comesWith: p.comesWith,
        sizeBase: p.size.base,
        sizeHeight: p.size.height,
        sizeDepth: p.size.depth,
        sizeDrop: p.size.drop,
      });
    }
  });

  insertMany();
}
