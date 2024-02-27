# Generated by Django 5.0.2 on 2024-02-27 13:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals_tracker', '0002_user_bio_user_points_alter_user_groups_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BigGoal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('description', models.TextField()),
                ('deadline', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='AntiGoal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('big_goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='goals_tracker.biggoal')),
            ],
        ),
        migrations.CreateModel(
            name='CheckpointGoal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=300)),
                ('description', models.TextField()),
                ('deadline', models.DateField()),
                ('big_goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='goals_tracker.biggoal')),
            ],
        ),
        migrations.CreateModel(
            name='DailySystems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=300)),
                ('big_goal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='goals_tracker.biggoal')),
            ],
        ),
    ]
