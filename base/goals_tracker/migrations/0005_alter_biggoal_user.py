# Generated by Django 5.0.2 on 2024-02-27 14:38

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('goals_tracker', '0004_biggoal_user_dailysystemcheckin'),
    ]

    operations = [
        migrations.AlterField(
            model_name='biggoal',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
