import prompt from "prompt-sync";
import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost:27017/FelixVallejoUppgift1")
  .catch(() => console.log("Couldn't connect to Database"));

const movieSchema = mongoose.Schema({
  title: { type: String },
  director: { type: String },
  releaseYear: { type: Number },
  genres: { type: [String] },
  ratings: { type: [Number] },
  cast: { type: [String] },
});

const movieModel = mongoose.model("Movies", movieSchema);

const p = prompt();

let runApp = true;

while (runApp) {
  console.log("---------------");
  console.log("Menu");
  console.log("1. Show all Movies.");
  console.log("2. Add new movie.");
  console.log("3. Update Movie Info.");
  console.log("4. Delete Movie.");
  console.log("5. Exit.");
  console.log("---------------");

  let input = p("Make a choice by entering a number: ");

  if (input == "1") {
    console.log("Viewing all Movies");
    const allMovies = await movieModel.find({}, { title: 1, _id: 0 });
    console.log(allMovies);
  } else if (input == "2") {
    console.log("Enter Information About The Movie");
    let movieTitle = "";
    while (!movieTitle) {
      movieTitle = p("Enter title of the movie: ");
      if (!movieTitle) {
        console.log("Title cannot be empty. Please try again.");
      }
    }

    let movieDirector = "";
    while (!movieDirector) {
      movieDirector = p("Enter director of the movie: ");
      if (!movieDirector) {
        console.log("Director cannot be empty. Please try again.");
      }
    }

    let movieReleaseYear = "";
    while (!movieReleaseYear || isNaN(movieReleaseYear)) {
      movieReleaseYear = p("Enter the year the movie was made: ");
      if (!movieReleaseYear || isNaN(movieReleaseYear)) {
        console.log(
          "Please enter a valid year. It cannot be empty or contain non-numeric characters."
        );
      }
    }

    let movieGenres = "";
    while (!movieGenres) {
      movieGenres = p("Enter genres that fit the movie (comma-separated): ");
      if (!movieGenres) {
        console.log("Genres cannot be empty. Please try again.");
      }
    }
    let genreArray = movieGenres.split(",").map((genre) => genre.trim());
    let movieRatings = "";
    while (!movieRatings) {
      movieRatings = p("Enter ratings that fit the movie (comma-separated): ");
      if (!movieRatings) {
        console.log("Ratings cannot be empty. Please try again.");
      }
    }
    let ratingArray = movieRatings.split(",").map((ratings) => ratings.trim());
    let movieActors = "";
    while (!movieActors) {
      movieActors = p("Enter actors that fit the movie (comma-separated): ");
      if (!movieActors) {
        console.log("Actors cannot be empty. Please try again.");
      }
    }
    let actorArray = movieActors.split(",").map((ratings) => ratings.trim());

    await movieModel
      .create({
        title: movieTitle,
        director: movieDirector,
        releaseYear: movieReleaseYear,
        genres: genreArray,
        ratings: ratingArray,
        cast: actorArray,
      })
      .then(() => console.log("Movie has been created"))
      .catch((error) => console.log("Something has gone wrong", error));
  } else if (input == "3") {
    let movieToEdit = p(
      "Type Movie Title of the movie you want to edit. (Case sensitive!) : "
    );
    let editMovie = await movieModel.exists({
      title: movieToEdit,
    });
    if (editMovie) {
      let newTitle = "";
      while (!newTitle) {
        newTitle = p("Enter new title of the movie: ");
        if (!newTitle) {
          console.log("Title cannot be empty. Please try again.");
        }
      }

      let newDirector = "";
      while (!newDirector) {
        newDirector = p("Enter new director of the movie: ");
        if (!newDirector) {
          console.log("Director cannot be empty. Please try again.");
        }
      }
      let newMovieReleaseYear = "";
      while (!newMovieReleaseYear || isNaN(newMovieReleaseYear)) {
        newMovieReleaseYear = p("Enter the new year the movie was made: ");
        if (!newMovieReleaseYear || isNaN(newMovieReleaseYear)) {
          console.log(
            "Please enter a valid year. It cannot be empty or contain non-numeric characters."
          );
        }
      }
      let newMovieGenres = "";
      while (!newMovieGenres) {
        newMovieGenres = p(
          "Enter new genres that fit the movie (comma-separated): "
        );
        if (!newMovieGenres) {
          console.log("Genres cannot be empty. Please try again.");
        }
      }
      let newGenreArray = newMovieGenres
        .split(",")
        .map((genre) => genre.trim());
      let newMovieRatings = "";
      while (!newMovieRatings) {
        newMovieRatings = p(
          "Enter new ratings that fit the movie (comma-separated): "
        );
        if (!newMovieRatings) {
          console.log("Ratings cannot be empty. Please try again.");
        }
      }
      let newRatingArray = newMovieRatings
        .split(",")
        .map((ratings) => ratings.trim());
      let newMovieActors = "";
      while (!newMovieActors) {
        newMovieActors = p(
          "Enter new actors that fit the movie (comma-separated): "
        );
        if (!newMovieActors) {
          console.log("Actors cannot be empty. Please try again.");
        }
      }
      let newActorArray = newMovieActors
        .split(",")
        .map((ratings) => ratings.trim());

      await movieModel
        .updateOne(
          { title: movieToEdit },
          {
            title: newTitle,
            director: newDirector,
            releaseYear: newMovieReleaseYear,
            genres: newGenreArray,
            ratings: newRatingArray,
            cast: newActorArray,
          }
        )
        .then(() => console.log("Movie has been updated"))
        .catch((error) => console.log("Something has gone wrong", error));
    } else {
      console.log("Movie doesn't exist");
    }
  } else if (input == "4") {
    let movieToDelete = p(
      "Type Movie Title of the movie you want to delete (Case sensitive!) : "
    );
    let deleteMovie = await movieModel.exists({
      title: movieToDelete,
    });
    if (deleteMovie) {
      await movieModel.deleteOne({
        title: movieToDelete,
      });
      console.log("Movie has been deleted");
    } else {
      console.log("Movie doesn't exist");
    }
  } else if (input == "5") {
    runApp = false;
  } else {
    console.log("Please enter a number between 1 and 5.");
  }
}
