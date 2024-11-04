package models

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/lib/pq"
)

type User struct {
	UserId       int       `json:"userId"`
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	Password     string    `json:"password"`
	DateOfBirth  time.Time `json:"dateOfBirth"`
	Name         string    `json:"name"`
	Country      string    `json:"country"`
	Languages    []string  `json:"languages"`
	Tags         []string  `json:"tags"`
	Boards       []string  `json:"boards"`
	Posts        []string  `json:"posts"`
	ProfileImage int       `json:"profileImage"`
	CoverImage   int       `json:"coverImage"`
}

func CreateUserTable(DB *sql.DB) error {
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS users (
		userId SERIAL PRIMARY KEY,
		username TEXT NOT NULL UNIQUE,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		dateOfBirth DATE NOT NULL,
		name TEXT,
		country TEXT,
		languages TEXT[],
		tags TEXT[],
		boards INTEGER[],
		posts INTEGER[],
		profileImage INTEGER,
		coverImage INTEGER
	);`
	return CreateTable(DB, createTableSQL)
}

func GetUser(DB *sql.DB, username string) (User, error) {
	query := `
    SELECT userId, username, email, password, dateOfBirth, name, country, languages, tags, boards, posts, profileImage, coverImage
    FROM users 
    WHERE username = $1`

	var user User
	row := DB.QueryRow(query, username)
	err := row.Scan(
		&user.UserId, &user.Username, &user.Email,
		&user.Password, &user.DateOfBirth, &user.Name, &user.Country,
		pq.Array(&user.Languages),
		pq.Array(&user.Tags),
		pq.Array(&user.Boards),
		pq.Array(&user.Posts),
		&user.ProfileImage,
		&user.CoverImage,
	)

	if err == sql.ErrNoRows {
		return User{}, fmt.Errorf("no user found with username: %s", username)
	} else if err != nil {
		log.Printf("Error retrieving user: %v\n", err)
		return User{}, err
	}

	if user.Languages == nil {
		user.Languages = []string{}
	}

	if user.Tags == nil {
		user.Tags = []string{}
	}

	if user.Boards == nil {
		user.Boards = []string{}
	}

	if user.Posts == nil {
		user.Posts = []string{}
	}

	return user, nil
}

func GetAllUsers(DB *sql.DB) ([]User, error) {
	query := `
    SELECT userId, username, email, password, dateOfBirth, name, country, languages, tags, boards, posts, profileImage, coverImage
    FROM users`

	rows, err := DB.Query(query)
	if err != nil {
		log.Printf("Error querying users: %v\n", err)
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		if err := rows.Scan(
			&user.UserId, &user.Username, &user.Email,
			&user.Password, &user.DateOfBirth, &user.Name, &user.Country,
			pq.Array(&user.Languages),
			pq.Array(&user.Tags),
			pq.Array(&user.Boards),
			pq.Array(&user.Posts),
			&user.ProfileImage,
			&user.CoverImage,
		); err != nil {
			log.Printf("Error scanning user: %v\n", err)
			return nil, err
		}

		if user.Languages == nil {
			user.Languages = []string{}
		}

		if user.Tags == nil {
			user.Tags = []string{}
		}

		if user.Boards == nil {
			user.Boards = []string{}
		}

		if user.Posts == nil {
			user.Posts = []string{}
		}

		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		log.Printf("Error iterating over users: %v\n", err)
		return nil, err
	}

	return users, nil
}