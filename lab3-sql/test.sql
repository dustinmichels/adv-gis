SELECT
    AVG(HHSIZ) AS avg_household_size
FROM
    HH
WHERE
    (INCOME < 4)
    AND (HH.MPO = "MAPC");