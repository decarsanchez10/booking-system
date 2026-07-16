<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class KnowledgeBaseController extends Controller
{
    public function categories()
    {
        return response()->json(
            DB::table('kb_categories')->where('is_active', true)->orderBy('name')->get()
        );
    }

    public function articles(Request $request)
    {
        $query = DB::table('kb_articles')
            ->join('kb_categories', 'kb_categories.id', '=', 'kb_articles.category_id')
            ->where('kb_articles.is_published', true)
            ->whereNull('kb_articles.deleted_at')
            ->select('kb_articles.*', 'kb_categories.name as category_name');

        if ($request->filled('q')) {
            $search = '%'.$request->string('q').'%';
            $query->where(fn ($builder) => $builder
                ->where('kb_articles.title', 'like', $search)
                ->orWhere('kb_articles.content', 'like', $search));
        }

        if ($request->filled('category')) {
            $query->where('kb_categories.slug', $request->string('category'));
        }

        return response()->json($query->latest('kb_articles.updated_at')->paginate(20));
    }

    public function show(int $article)
    {
        $record = DB::table('kb_articles')
            ->join('kb_categories', 'kb_categories.id', '=', 'kb_articles.category_id')
            ->where('kb_articles.id', $article)
            ->whereNull('kb_articles.deleted_at')
            ->select('kb_articles.*', 'kb_categories.name as category_name')
            ->first();

        abort_unless($record, 404, 'Article not found.');
        DB::table('kb_articles')->where('id', $article)->increment('view_count');

        return response()->json($record);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => 'required|exists:kb_categories,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'tags' => 'nullable|array',
            'is_published' => 'nullable|boolean',
        ]);

        $id = DB::table('kb_articles')->insertGetId([
            'category_id' => $data['category_id'],
            'author_id' => $request->user()->id,
            'title' => $data['title'],
            'slug' => Str::slug($data['title']).'-'.Str::lower(Str::random(6)),
            'content' => $data['content'],
            'tags' => isset($data['tags']) ? json_encode($data['tags']) : null,
            'is_published' => $data['is_published'] ?? false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(DB::table('kb_articles')->find($id), 201);
    }

    public function update(Request $request, int $article)
    {
        abort_unless(DB::table('kb_articles')->where('id', $article)->whereNull('deleted_at')->exists(), 404);

        $data = $request->validate([
            'category_id' => 'sometimes|required|exists:kb_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'tags' => 'nullable|array',
            'is_published' => 'sometimes|boolean',
        ]);

        if (isset($data['tags'])) {
            $data['tags'] = json_encode($data['tags']);
        }

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']).'-'.$article;
        }

        $data['updated_at'] = now();
        DB::table('kb_articles')->where('id', $article)->update($data);

        return response()->json(DB::table('kb_articles')->find($article));
    }

    public function destroy(int $article)
    {
        abort_unless(DB::table('kb_articles')->where('id', $article)->exists(), 404);
        DB::table('kb_articles')->where('id', $article)->update(['deleted_at' => now()]);

        return response()->json(['message' => 'Article deleted.']);
    }
}
