# Generated by Django 5.0.2 on 2024-05-10 05:16

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals_tracker', '0010_delete_dailysystemcheckin'),
    ]

    operations = [
        migrations.CreateModel(
            name='DailySystemCheckIn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(auto_now_add=True)),
                ('big_goal', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='goals_tracker.biggoal')),
                ('daily_system', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='goals_tracker.dailysystem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
