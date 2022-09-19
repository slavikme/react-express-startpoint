INSERT INTO roles (role_id, role_name)
VALUES (1, 'admin');

INSERT INTO locations (location_id, country_code, city, state, address1, address2, address3, geog)
VALUES (1, 'ISR', 'Tel Aviv', null, '21 Giv''at HaTahmoshet st', null, null, ST_SetSRID(ST_MakePoint(34.791713, 32.073501), 4326)),
       (2, 'USA', 'Holly', 'MI', '722 E Sherman St', 'Room 225', null, ST_SetSRID(ST_MakePoint(-83.613782, 42.788545), 4326));

INSERT INTO organisations (organisation_id, name, type, location_id)
VALUES (1, 'Apple Ltd.', 'company', 1);

INSERT INTO contacts (contact_id, first_name, last_name, organisation_id, location_id, phone_country_code, phone_number)
VALUES (1, 'John', 'Smith', 1, 2, '972', '543210123');

INSERT INTO accounts (user_id, username, password, email, created_on, contact_id)
VALUES (1, 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', 'admin@example.com', '2022-07-25 18:00:00', 1);

INSERT INTO account_roles (user_id, role_id, grant_date)
VALUES (1, 1, '2022-07-25 18:00:00');
