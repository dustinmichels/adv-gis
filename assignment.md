# Assignment 3: GIS

Dustin Michels
UEP 235 - Adv GIS
Sep 24, 2025

❗️ _NOTE:_ SQL code can be copied if you hover over the block :)

## Question 1: SQL Queries in Access

### (A) What is the average household size for low-income households in the MAPC region?

Code:

```sql
SELECT AVG(HHSIZ) AS avg_household_size
FROM HH
WHERE INCOME < 4;
```

Output:

| avg_household_size |
| :----------------- |
| 1.69566457501426   |

### (B) What is the average age of women versus men in low-income households in the MAPC region where the person reported their age (exclude records when AGE=99 or 0)?

Code:

```sql
SELECT
    PER.GEND,
    AVG(PER.AGE) AS average_age
FROM HH, PER
WHERE (HH.SAMPN = PER.SAMPN)
    AND (HH.MPO = "MAPC")
    AND (HH.INCOME < 4)
    AND (PER.AGE <> 99 AND PER.AGE <> 0)
GROUP BY PER.GEND;
```

Output:

| GEND | average_age      |
| :--- | :--------------- |
| 1    | 46.6310043668122 |
| 2    | 50.0327635327635 |

### (C) What is the average trip duration for low-income women versus low-income men living in the MAPC region who reported their trip duration?

Code:

_Simpler:_

```sql
SELECT GEND AS PersonGender, AVG(TRPDUR) AS AverageTripDuration
FROM LowincomeMAPCtrips
WHERE TRPDUR > 0
GROUP BY GEND;
```

_Fancier:_

```sql
SELECT
    Switch(
        GEND = 1,
        "Male",
        GEND = 2,
        "Female",
        GEND = 9,
        "Refused",
    ) AS PersonGender,
    AVG(TRPDUR) AS AverageTripDuration
FROM
    LowincomeMAPCtrips
WHERE
    TRPDUR > 0
GROUP BY
    GEND;
```

Output:

| PersonGender | AverageTripDuration |
| :----------- | :------------------ |
| Male         | 16.1498731842287    |
| Female       | 15.7362163768762    |

### (D) What percentage of trips made by low-income households in MAPC region were by transit Bus, Subway, Walk, Bike, Auto driver and Auto passenger?

Code:

```sql
SELECT
    SWITCH(
        MODE = 1, 'Walk',
        MODE = 2, 'Bike',
        MODE = 3, 'Auto Driver',
        MODE = 4, 'Auto Passenger',
        MODE = 5, 'Transit Bus',
        MODE = 6, 'Subway',
        True, 'Other'
    ) AS TransportationMode,
    COUNT(*) AS TripCount,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM LowincomeMAPCtrips)), 2) AS PercentageOfTrips
FROM LowincomeMAPCtrips
GROUP BY SWITCH(
        MODE = 1, 'Walk',
        MODE = 2, 'Bike',
        MODE = 3, 'Auto Driver',
        MODE = 4, 'Auto Passenger',
        MODE = 5, 'Transit Bus',
        MODE = 6, 'Subway',
        True, 'Other'
    )
ORDER BY COUNT(*) DESC;
```

This one got a little crazy! I tried to ensure I was counting the percentage of _all_ trips that occurred by (for example) walking (30.45%), rather than the percentage walking trips out of just the selected modes (38.36%).

Output:

| TransportationMode | TripCount | PercentageOfTrips |
| :----------------- | :-------- | :---------------- |
| Walk               | 4090      | 30.45             |
| Auto Driver        | 3338      | 24.85             |
| Other              | 2770      | 20.62             |
| Auto Passenger     | 1197      | 8.91              |
| Transit Bus        | 1176      | 8.76              |
| Subway             | 729       | 5.43              |
| Bike               | 131       | 0.98              |

![chart](https://docs.google.com/spreadsheets/d/e/2PACX-1vTfIeoAAmBpcwKe19b_FAj4szhgk3B6lI0ioN72BDV1-daGdDKzc_7SQchliNwbpgZJr1swHici1E0w/pubchart?oid=1524727642&format=image)

_Figure 1:_ Number of trips made by various transportation modes by low-income households in the MAPC region based on Massachusetts Travel Survey.

### (E) What is the average trip duration of a walk trip made by women over the age of 65 in low-income households in the MAPC region versus the walk trip made by men over the age of 65? You can use low-income trips in MAPC that you imported for this. You should use a group by query for this and exclude people who did not report their age (AGE=99) or trip duration (TRPDUR=0). (1 point)

Code:

```sql
SELECT
    Switch(
        GEND = 1, "Male",
        GEND = 2, "Female",
        GEND = 9, "Refused"
    ) AS Gender,
    COUNT(*) AS WalkTripCount,
    AVG(TRPDUR) AS AverageTripDuration
FROM LowincomeMAPCtrips
WHERE MODE = 1
    AND AGE > 65
    AND AGE <> 99
    AND TRPDUR > 0
GROUP BY GEND
ORDER BY GEND;
```

## Question 2: Spatial or Select by Location Queries in ArcGIS Pro (2 points)
