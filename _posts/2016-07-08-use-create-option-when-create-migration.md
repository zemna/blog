---
layout: post
title:  "Use --create option when create migration"
excerpt: "Learning how to use --create option when create migration in Laravel"
date:   2016-07-08 08:15:00 +0700
categories: laravel
tags: laravel migration
---

To create migration, we can use this artisan command.

```bash
$ php artisan make:migration create_companies_table
```

Laravel will create a new migration file in `database/migrations` directory.

Generated file is like this:

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
```

`up()` method is used to create a new tables or add new columns to table.
`down()` method is used to rollback.

We can use `--create` option when create migration to automatically generate base code.

```bash
$ php artisan make:migration create_companies_table --create=companies
```

Generated file is like this:

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCompaniesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('companies');
    }
}
```