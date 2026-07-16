<?php

declare(strict_types=1);

$databasePath = dirname(__DIR__).DIRECTORY_SEPARATOR.'database'.DIRECTORY_SEPARATOR.'database.sqlite';

if (! file_exists($databasePath)) {
    http_response_code(404);
    exit('Database file not found: '.$databasePath);
}

$pdo = new PDO('sqlite:'.$databasePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$tables = array_map(
    static fn (array $row): string => $row['name'],
    $pdo->query("
        select name
        from sqlite_master
        where type = 'table'
        and name not like 'sqlite_%'
        order by name
    ")->fetchAll(PDO::FETCH_ASSOC)
);

$selectedTable = $_GET['table'] ?? ($tables[0] ?? null);
if (! in_array($selectedTable, $tables, true)) {
    $selectedTable = $tables[0] ?? null;
}

$columns = [];
$rows = [];

if ($selectedTable) {
    $columns = array_map(
        static fn (array $row): string => $row['name'],
        $pdo->query('pragma table_info("'.str_replace('"', '""', $selectedTable).'")')->fetchAll(PDO::FETCH_ASSOC)
    );

    $statement = $pdo->query('select * from "'.str_replace('"', '""', $selectedTable).'" limit 50');
    $rows = $statement->fetchAll(PDO::FETCH_ASSOC);
}

function h(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Database Browser</title>
    <style>
        body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #101418; color: #e9eef4; }
        .shell { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
        aside { background: #171d24; border-right: 1px solid #28313c; padding: 20px; }
        main { min-width: 0; padding: 24px; }
        h1 { font-size: 18px; margin: 0 0 18px; }
        h2 { font-size: 24px; margin: 0 0 18px; }
        a { color: inherit; text-decoration: none; }
        .table-link { display: block; padding: 10px 12px; border-radius: 6px; color: #b9c3cf; word-break: break-word; }
        .table-link.active, .table-link:hover { background: #24303b; color: #fff; }
        .table-wrap { overflow: auto; border: 1px solid #28313c; border-radius: 8px; background: #12171d; }
        table { width: 100%; border-collapse: collapse; min-width: 760px; }
        th, td { border-bottom: 1px solid #28313c; padding: 10px 12px; text-align: left; vertical-align: top; font-size: 14px; }
        th { position: sticky; top: 0; background: #1d2530; color: #fff; }
        td { color: #d2d9e2; max-width: 360px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .muted { color: #8d99a7; margin-bottom: 18px; }
        @media (max-width: 800px) { .shell { grid-template-columns: 1fr; } aside { border-right: 0; border-bottom: 1px solid #28313c; } }
    </style>
</head>
<body>
    <div class="shell">
        <aside>
            <h1>Database Tables</h1>
            <?php foreach ($tables as $table): ?>
                <a class="table-link <?= $table === $selectedTable ? 'active' : '' ?>" href="?table=<?= urlencode($table) ?>">
                    <?= h($table) ?>
                </a>
            <?php endforeach; ?>
        </aside>
        <main>
            <h2><?= h($selectedTable ?: 'No tables found') ?></h2>
            <div class="muted">Showing up to 50 rows from the selected table.</div>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <?php foreach ($columns as $column): ?>
                                <th><?= h($column) ?></th>
                            <?php endforeach; ?>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($rows): ?>
                            <?php foreach ($rows as $row): ?>
                                <tr>
                                    <?php foreach ($columns as $column): ?>
                                        <td title="<?= h($row[$column] ?? '') ?>"><?= h($row[$column] ?? '') ?></td>
                                    <?php endforeach; ?>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr><td colspan="<?= max(count($columns), 1) ?>">No rows in this table yet.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</body>
</html>
