-- =========================
-- 1. regions
-- =========================
CREATE TABLE regions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_mvp BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. contents
-- =========================
CREATE TABLE contents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title_ko VARCHAR(100) NOT NULL,
    title_en VARCHAR(100),
    content_type VARCHAR(30) NOT NULL, -- DRAMA, SURVIVAL, MOVIE 등
    release_year INT,
    description TEXT,
    poster_url TEXT,
    is_mvp BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. places
-- =========================
CREATE TABLE places (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    region_id BIGINT NOT NULL,
    name VARCHAR(120) NOT NULL,
    category VARCHAR(50) NOT NULL, -- filming_site, cafe, museum, market 등
    road_address VARCHAR(255),
    jibun_address VARCHAR(255),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    short_description VARCHAR(255),
    description TEXT,
    opening_hours TEXT,
    closed_days TEXT,
    price_info TEXT,
    contact VARCHAR(50),
    website_url TEXT,
    image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_places_region
        FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- =========================
-- 4. place_tags
-- =========================
CREATE TABLE place_tags (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_key VARCHAR(50) NOT NULL UNIQUE,   -- nature, photo_spot, family, walking 등
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 5. place_tag_mappings
-- =========================
CREATE TABLE place_tag_mappings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    place_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_place_tag_mappings_place
        FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    CONSTRAINT fk_place_tag_mappings_tag
        FOREIGN KEY (tag_id) REFERENCES place_tags(id) ON DELETE CASCADE,
    CONSTRAINT uq_place_tag_mapping UNIQUE (place_id, tag_id)
);

-- =========================
-- 6. content_place_mappings
-- =========================
CREATE TABLE content_place_mappings (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id BIGINT NOT NULL,
    place_id BIGINT NOT NULL,
    scene_note TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_content_place_mappings_content
        FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    CONSTRAINT fk_content_place_mappings_place
        FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
    CONSTRAINT uq_content_place_mapping UNIQUE (content_id, place_id)
);

-- =========================
-- 7. travel_profiles
-- =========================
CREATE TABLE travel_profiles (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trip_start_date DATE NOT NULL,
    trip_end_date DATE NOT NULL,
    transport_mode VARCHAR(30),   -- car, public_transport, mixed
    pace_level VARCHAR(30),       -- relaxed, moderate, tight
    budget_level VARCHAR(30),     -- low, medium, high
    companion_type VARCHAR(30),   -- solo, couple, family, friends
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_trip_dates CHECK (trip_end_date >= trip_start_date)
);

-- =========================
-- 8. travel_profile_regions
-- =========================
CREATE TABLE travel_profile_regions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    travel_profile_id BIGINT NOT NULL,
    region_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_travel_profile_regions_profile
        FOREIGN KEY (travel_profile_id) REFERENCES travel_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_travel_profile_regions_region
        FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
    CONSTRAINT uq_travel_profile_region UNIQUE (travel_profile_id, region_id)
);

-- =========================
-- 9. travel_profile_tag_preferences
-- =========================
CREATE TABLE travel_profile_tag_preferences (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    travel_profile_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_travel_profile_tag_preferences_profile
        FOREIGN KEY (travel_profile_id) REFERENCES travel_profiles(id) ON DELETE CASCADE,
    CONSTRAINT fk_travel_profile_tag_preferences_tag
        FOREIGN KEY (tag_id) REFERENCES place_tags(id) ON DELETE CASCADE,
    CONSTRAINT uq_travel_profile_tag_preference UNIQUE (travel_profile_id, tag_id)
);

-- =========================
-- 10. itineraries
-- =========================
CREATE TABLE itineraries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    travel_profile_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    summary TEXT,
    total_days INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_itineraries_travel_profile
        FOREIGN KEY (travel_profile_id) REFERENCES travel_profiles(id) ON DELETE CASCADE
);

-- =========================
-- 11. itinerary_items
-- =========================
CREATE TABLE itinerary_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    itinerary_id BIGINT NOT NULL,
    day_number INT NOT NULL,
    sequence_no INT NOT NULL,
    place_id BIGINT NOT NULL,
    start_time TIME,
    end_time TIME,
    memo TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_itinerary_items_itinerary
        FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE,
    CONSTRAINT fk_itinerary_items_place
        FOREIGN KEY (place_id) REFERENCES places(id),
    CONSTRAINT uq_itinerary_day_sequence UNIQUE (itinerary_id, day_number, sequence_no)
);

-- =========================
-- indexes
-- =========================
CREATE INDEX idx_places_region_id ON places(region_id);
CREATE INDEX idx_place_tag_mappings_place_id ON place_tag_mappings(place_id);
CREATE INDEX idx_place_tag_mappings_tag_id ON place_tag_mappings(tag_id);
CREATE INDEX idx_content_place_mappings_content_id ON content_place_mappings(content_id);
CREATE INDEX idx_content_place_mappings_place_id ON content_place_mappings(place_id);
CREATE INDEX idx_travel_profile_regions_profile_id ON travel_profile_regions(travel_profile_id);
CREATE INDEX idx_travel_profile_regions_region_id ON travel_profile_regions(region_id);
CREATE INDEX idx_travel_profile_tag_preferences_profile_id ON travel_profile_tag_preferences(travel_profile_id);
CREATE INDEX idx_travel_profile_tag_preferences_tag_id ON travel_profile_tag_preferences(tag_id);
CREATE INDEX idx_itineraries_travel_profile_id ON itineraries(travel_profile_id);
CREATE INDEX idx_itinerary_items_itinerary_id ON itinerary_items(itinerary_id);
CREATE INDEX idx_itinerary_items_place_id ON itinerary_items(place_id);