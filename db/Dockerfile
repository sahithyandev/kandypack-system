FROM postgres:17

# Install pg_cron via apt
RUN apt-get update \
 && apt-get install -y postgresql-17-cron \
 && rm -rf /var/lib/apt/lists/*

# Enable pg_cron on startup
RUN echo "shared_preload_libraries = 'pg_cron'" >> /usr/share/postgresql/postgresql.conf.sample \
 && echo "cron.database_name = 'kandypack'" >> /usr/share/postgresql/postgresql.conf.sample
