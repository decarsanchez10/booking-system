<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Database Browser</title>
    <style>
        :root {
            color-scheme: dark;
            font-family: Arial, Helvetica, sans-serif;
            background: #101418;
            color: #e9eef4;
        }

        body {
            margin: 0;
        }

        .shell {
            display: grid;
            grid-template-columns: 260px 1fr;
            min-height: 100vh;
        }

        aside {
            background: #171d24;
            border-right: 1px solid #28313c;
            padding: 20px;
        }

        main {
            min-width: 0;
            padding: 24px;
        }

        h1 {
            font-size: 18px;
            margin: 0 0 18px;
        }

        h2 {
            font-size: 24px;
            margin: 0 0 18px;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        .table-link {
            display: block;
            padding: 10px 12px;
            border-radius: 6px;
            color: #b9c3cf;
            word-break: break-word;
        }

        .table-link.active,
        .table-link:hover {
            background: #24303b;
            color: #ffffff;
        }

        .table-wrap {
            overflow: auto;
            border: 1px solid #28313c;
            border-radius: 8px;
            background: #12171d;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 760px;
        }

        th,
        td {
            border-bottom: 1px solid #28313c;
            padding: 10px 12px;
            text-align: left;
            vertical-align: top;
            font-size: 14px;
        }

        th {
            position: sticky;
            top: 0;
            background: #1d2530;
            color: #ffffff;
            font-weight: 700;
        }

        td {
            color: #d2d9e2;
            max-width: 360px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .muted {
            color: #8d99a7;
            margin-bottom: 18px;
        }

        @media (max-width: 800px) {
            .shell {
                grid-template-columns: 1fr;
            }

            aside {
                border-right: 0;
                border-bottom: 1px solid #28313c;
            }
        }
    </style>
</head>
<body>
    <div class="shell">
        <aside>
            <h1>Database Tables</h1>
            @foreach ($tables as $table)
                <a
                    class="table-link {{ $table === $selectedTable ? 'active' : '' }}"
                    href="{{ url('/database?table=' . urlencode($table)) }}"
                >
                    {{ $table }}
                </a>
            @endforeach
        </aside>

        <main>
            <h2>{{ $selectedTable ?: 'No tables found' }}</h2>
            <div class="muted">Showing up to 50 rows from the selected table.</div>

            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            @foreach ($columns as $column)
                                <th>{{ $column }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($rows as $row)
                            <tr>
                                @foreach ($columns as $column)
                                    <td title="{{ (string) ($row->{$column} ?? '') }}">
                                        {{ (string) ($row->{$column} ?? '') }}
                                    </td>
                                @endforeach
                            </tr>
                        @empty
                            <tr>
                                <td colspan="{{ max(count($columns), 1) }}">No rows in this table yet.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</body>
</html>
