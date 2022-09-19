CREATE EXTENSION Postgis;

CREATE TABLE IF NOT EXISTS locations
(
    location_id  SERIAL PRIMARY KEY,
    country_code VARCHAR(3)         NOT NULL,
    city         VARCHAR(100)       NOT NULL,
    state        VARCHAR(100)       DEFAULT NULL,
    address1     VARCHAR(150)       NOT NULL,
    address2     VARCHAR(150)       DEFAULT NULL,
    address3     VARCHAR(150)       DEFAULT NULL,
    geog         GEOGRAPHY(POINT)   DEFAULT NULL
);

CREATE TYPE organisation_types AS ENUM ('company', 'institution', 'association', 'government');

CREATE TABLE IF NOT EXISTS organisations
(
    organisation_id SERIAL PRIMARY KEY,
    name            VARCHAR(150)       NOT NULL,
    type            organisation_types NOT NULL,
    location_id     INT REFERENCES locations (location_id) DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS contacts
(
    contact_id         SERIAL PRIMARY KEY,
    first_name         VARCHAR(50)      NOT NULL,
    last_name          VARCHAR(100)     DEFAULT NULL,
    organisation_id    INT REFERENCES organisations (organisation_id) DEFAULT NULL,
    location_id        INT REFERENCES locations (location_id) DEFAULT NULL,
    phone_country_code VARCHAR(5)       DEFAULT NULL,
    phone_number       VARCHAR(30)      DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS accounts
(
    user_id    SERIAL PRIMARY KEY,
    username   VARCHAR(50)  UNIQUE  NOT NULL,
    password   VARCHAR(50)          NOT NULL,
    email      VARCHAR(255) UNIQUE  NOT NULL,
    contact_id INT REFERENCES contacts (contact_id),
    created_on TIMESTAMP            NOT NULL,
    last_login TIMESTAMP            DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS roles
(
    role_id   SERIAL PRIMARY KEY,
    role_name VARCHAR(255)  UNIQUE  NOT NULL
);

CREATE TABLE IF NOT EXISTS account_roles
(
    user_id    INT          NOT NULL    REFERENCES accounts (user_id),
    role_id    INT          NOT NULL    REFERENCES roles (role_id),
    grant_date TIMESTAMP    DEFAULT NULL,
    PRIMARY KEY (user_id, role_id)
);
