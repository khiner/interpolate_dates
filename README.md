# `interpolate_dates`

Linearly interpolate missing dates in an ordered list with missing entries.

## Motivation

I recently subscribed to [letterboxd](https://letterboxd.com/) to keep track of the movies I watch. For several years,
I've been tracking every movie I watch in a simple spreadsheet, but I didn't track the watch date. **I wanted to
estimate what dates I watched the movies in my list** so I
could [import them into letterboxd](https://letterboxd.com/about/importing-data/) with date information.

In my spreadsheet list, I was only tracking movie titles, with no date information. To get started estimating watch
dates, I downloaded my Netflix viewing history to get exact dates for the subset of movies in my (date-less) list that I
happened to watch on Netflix. My wife used some spreadsheet magic (`LOOKUP`) to sync up watch dates to my list for the
titles with exact matches.

All said and done, **the movies I watched on Netflix and tracked with the exact string title in Netflix's database
accounted for only about 16% of my watch list.** To fill in the gaps, I figured that linearly interpolating between the
known dates would be the best estimate I could hope for.

## Details

Provide a CSV file with a column named `Date` containing date strings, and potentially empty values. This script will
output a new `Date` column, with a date for each line, formatted as `yyyy-mm-dd`. Values that were present in the
original `Date` column will remain the same (disregarding the potentially new formatting), and **empty values will be
populated by linearly interpolating between the nearest surrounding present dates.**

### Example

Let's say I know I watched movie `A` on `2021-1-1`, movie `D` on `2021-1-4`, and movie `F` on `2021-1-6` Now let's say I
watched movies `B` and `C`
(in that order) inbetween watching `A` and `D`, and movie `E` between `D` and `F`, but I don't know what dates I watched
them. If I put those dates in a CSV file with (at least) a `Date` column, in the watch order, with empty lines for each
unknown date, and ran it through this script, I would get:

| Input    | Output   |
|----------|----------|
| 2021-1-1 | 2021-1-1 |
|          | 2021-1-2 |
|          | 2021-1-3 |
| 2021-1-4 | 2021-1-4 |
|          | 2021-1-5 |
| 2021-1-6 | 2021-1-6 |

Although this example uses nice round dates, the interpolation is done exactly
(via [d3-interpolateDate](https://observablehq.com/@d3/d3-interpolatedate)), and will work as you'd expect with things
like repeated or out-of-order dates.

## Usage

This script accepts a single file path argument, which defaults to `dates.csv`. If more than one argument is passed in,
the first argument is used as the file path.

```shell
$ npm ci
$ npm start dates.csv
```
