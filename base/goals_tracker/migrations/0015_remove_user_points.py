# Generated by Django 5.0.2 on 2024-08-18 10:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('goals_tracker', '0014_remove_user_bio'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='points',
        ),
    ]
