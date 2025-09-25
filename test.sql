SELECT
    Switch(
        PER.GEND = 1,
        "Male",
        PER.GEND = 2,
        "Female",
        True,
        "Undefined"
    ) AS Gender,
    COUNT(*) AS Number_of_Bicycle_Trips,
    AVG(PLACE.TRPDUR) AS Average_Duration_Minutes
FROM
    PLACE,
    PER
WHERE
    PLACE.SAMPN = PER.SAMPN
    AND PLACE.PERNO = PER.PERNO
    AND PLACE.MODE = 2
    AND PLACE.PLANO > 1
    AND PLACE.TRPDUR IS NOT NULL
GROUP BY
    PER.GEND